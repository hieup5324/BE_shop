import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { FindOptionsWhere, Or, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../users/userEntity/user.entity';
import { OrderEntity } from './entity/order.entity';
import { CreateOrderDto } from './orderDTO/createOrder.dto';
import { ProductEntity } from '../products/entity/product.entity';
import { ProductService } from '../products/product.service';
// import { OrdersProductsEntity } from './entity/order-product.entity';
import { UpdateOrderDto } from './orderDTO/updateOrder.dto';
import { UpdateOrderStatusDto } from './orderDTO/updateOrder-status.dto';
import { OrderRepository } from './order.repository';
import { CartService } from '../cart/cart.service';
import { OrderItemRepository } from './orderItem.repository';
import {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_TYPE,
} from '../shared/constants/common';
import { v4 as uuidv4 } from 'uuid';
import { VnPayService } from '../payment/VnPayService.service';
import * as dayjs from 'dayjs';
import { OrderQuery } from './orderDTO/orders.query';
import { GHNService } from '../GHN/GHN.service';
import { StatisticQuery } from '../statistics/dto/statistic.query';
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly cartService: CartService,
    private readonly vnpayService: VnPayService,
    private readonly ghnService: GHNService,
    @Inject(forwardRef(() => ProductService))
    private readonly productService: ProductService,
  ) {}

  async findOrderById(id: number) {
    return await this.orderRepo.findOne({ where: { id } });
  }

  async getUserOrders(userId: number) {
    const orders = await this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
      order: { createdAt: 'DESC' },
    });

    return orders.map((order) => ({
      id: order.id,
      order_code: order.order_code,
      total_price: order.total_price,
      status: order.status,
      payment_type: order.payment_type,
      createdAt: order.createdAt,
      status_payment: order.status_payment,
      // receiver_address: order.receiver_address,
      orderItems: order.orderItems.map((item) => ({
        product_name: item.product.product_name,
        quantity: item.quantity,
        total_price: item.price,
        price: item.product.price,
        photo_url: item.product.photo_url,
      })),
    }));
  }

  async getUserOrdersV2(userId: number, query: OrderQuery) {
    return await this.orderRepo.getOrders(userId, query);
  }

  async createOrder(userId: number, dto: CreateOrderDto) {
    const cart = await this.cartService.findCartByUserId(userId);

    if (!cart || cart.cartItems.length === 0) {
      throw new NotFoundException('Giỏ hàng trống, không thể đặt hàng');
    }

    for (const item of cart.cartItems) {
      const product = await this.productService.findById(item.product.id);
      if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Sản phẩm ${product.product_name} không đủ số lượng trong kho`,
        );
      }
    }

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.price,
      0,
    );

    const order = this.orderRepo.create({
      user: { id: userId },
      order_code: `ORD-${uuidv4().split('-')[0]}`,
      status: ORDER_STATUS.PENDING,
      total_price: totalAmount,
      payment_type: dto.payment_type,
    });

    const savedOrder = await this.orderRepo.save(order);
    const orderItems = cart.cartItems.map((item) =>
      this.orderItemRepo.create({
        order: savedOrder,
        product: item.product,
        quantity: item.quantity,
        price: item.price,
      }),
    );
    try {
      const { order_code_transport, fee_transport } =
        await this.ghnService.createOrderGHN({
          payment_type_id: 1,
          note: 'Đơn hàng từ Shop LapTop',
          required_note: 'CHOXEMHANGKHONGTHU',
          from_name: 'Shop LapTop',
          from_phone: '0333387484',
          from_address: 'Đại học Xây Dựng',
          from_ward_code: '13010',
          from_district_id: 3440,

          to_name: dto.receiver_name,
          to_phone: dto.receiver_phone,
          to_address: dto.receiver_address,
          to_ward_code: dto.ward_id,
          to_district_id: dto.district_id,

          weight: 20000,
          length: 50,
          width: 50,
          height: 50,
          service_type_id: 2,
          items: cart.cartItems.map((item) => ({
            name: item.product.product_name,
            quantity: item.quantity,
            price: item.price,
            weight: 10000,
          })),
        });

      const updateOrder = await this.orderRepo.save({
        ...order,
        order_code_transport,
        fee_transport,
        total_price: savedOrder.total_price + fee_transport,
        receiver_address: dto.address,
        status: ORDER_STATUS.WAITING_PICK_UP,
        receiver_name: dto.receiver_name,
        receiver_phone: dto.receiver_phone,
      });

      await this.orderItemRepo.save(orderItems);
      await this.cartService.deleteCartItem(userId);

      for (const item of cart.cartItems) {
        await this.productService.updateQuantity(
          item.product.id,
          item.quantity,
          'decrease',
        );
      }

      switch (dto.payment_type) {
        case PAYMENT_TYPE.VNPAY:
          return await this.vnpayService.createVNPayLink(updateOrder);
        case PAYMENT_TYPE.CASH:
          return savedOrder;
        default:
          throw new BadRequestException('Phương thức thanh toán không hợp lệ');
      }
    } catch (error) {
      console.error('Error saving order items:', error);
      if (savedOrder.order_code_transport) {
        await this.ghnService.cancenlOrderGHN({
          order_code: savedOrder.order_code_transport,
        });
      }
    }
  }

  async updateOrderStatus(query: any, res: any) {
    try {
      const {
        vnp_TxnRef,
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
      } = query;

      const order = await this.orderRepo.findOne({
        where: { order_code: vnp_TxnRef },
        relations: ['orderItems', 'orderItems.product'],
      });

      if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

      const status =
        vnp_ResponseCode === '00'
          ? PAYMENT_STATUS.SUCCESS
          : PAYMENT_STATUS.FAILED;

      if (status === PAYMENT_STATUS.FAILED) {
        if (order.order_code_transport) {
          await this.ghnService.cancenlOrderGHN({
            order_codes: [order.order_code_transport],
          });
        }

        for (const item of order.orderItems) {
          await this.productService.updateQuantity(
            item.product.id,
            item.quantity,
            'increase',
          );
        }

        order.status_payment = status;
        await this.orderRepo.save(order);

        return res.redirect('http://localhost:3000/payment/failed');
      }

      order.status_payment = status;
      const transaction = await this.vnpayService.getTransactionByOrderId(
        order.id,
      );
      transaction.amount = parseInt(vnp_Amount) / 100;
      transaction.bank_code = vnp_BankCode;
      transaction.bank_tran_no = vnp_BankTranNo;
      transaction.card_type = vnp_CardType;
      transaction.order_info = vnp_OrderInfo;
      transaction.pay_date = new Date(
        dayjs(vnp_PayDate, 'YYYYMMDDHHmmss').toISOString(),
      );
      transaction.response_code = vnp_ResponseCode;
      transaction.transaction_no = vnp_TransactionNo;
      transaction.transaction_status =
        vnp_TransactionStatus === '00'
          ? PAYMENT_STATUS.SUCCESS
          : PAYMENT_STATUS.FAILED;

      await this.vnpayService.updateTransaction(transaction);
      await this.orderRepo.save(order);

      return res.redirect(
        `http://localhost:3000/payment?transactionId=${transaction.id}`,
      );
    } catch (error) {
      console.error('Error updating order status:', error);
      return res.redirect('http://localhost:3000/payment/failed');
    }
  }

  async getTotalRevenue() {
    const [orders, totalOrdersCompleted] = await this.orderRepo.findAndCount({
      where: {
        status: ORDER_STATUS.DELIVERED,
        status_payment: PAYMENT_STATUS.SUCCESS,
      },
    });
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total_price,
      0,
    );
    return {
      totalRevenue,
      totalOrdersCompleted,
    };
  }

  async getAllOderRevenen(query: StatisticQuery) {
    const year = query.year || new Date().getFullYear().toString();

    const orders = await this.orderRepo
      .createQueryBuilder('order')
      .select('EXTRACT(MONTH FROM order.createdAt)', 'month')
      .addSelect('SUM(order.total_price)', 'total')
      .where('order.status = :status', { status: ORDER_STATUS.DELIVERED })
      .andWhere('order.status_payment = :paymentStatus', {
        paymentStatus: PAYMENT_STATUS.SUCCESS,
      })
      .andWhere('EXTRACT(YEAR FROM order.createdAt) = :year', { year })
      .groupBy('EXTRACT(MONTH FROM order.createdAt)')
      .orderBy('month', 'ASC')
      .getRawMany();

    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];

    // Tạo mảng kết quả với tất cả các tháng
    const result = monthNames.map((name, index) => {
      const monthData = orders.find(
        (order) => parseInt(order.month) === index + 1,
      );
      return {
        name,
        total: monthData ? parseInt(monthData.total) : 0,
      };
    });

    return {
      data: result,
    };
  }
}
