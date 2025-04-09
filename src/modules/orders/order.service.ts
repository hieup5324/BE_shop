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
@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly orderItemRepo: OrderItemRepository,
    private readonly cartService: CartService,
    private readonly vnpayService: VnPayService,
    private readonly ghnService: GHNService,
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

    const totalAmount = cart.cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
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

    await this.orderRepo.save({
      ...order,
      order_code_transport,
      fee_transport,
      total_price: savedOrder.total_price + fee_transport,
      receiver_address: dto.address,
    });

    await this.orderItemRepo.save(orderItems);
    await this.cartService.deleteCartItem(userId);

    switch (dto.payment_type) {
      case PAYMENT_TYPE.VNPAY:
        return await this.vnpayService.createVNPayLink(savedOrder);
      case PAYMENT_TYPE.CASH:
        return savedOrder;
      default:
        throw new BadRequestException('Phương thức thanh toán không hợp lệ');
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
      });
      if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
      const status =
        vnp_ResponseCode === '00'
          ? PAYMENT_STATUS.SUCCESS
          : PAYMENT_STATUS.FAILED;
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
      console.log(error);
    }
  }
  // async create(
  //   requestBody: CreateOrderDto,
  //   currentUser: UserEntity,
  // ): Promise<OrderEntity> {
  //   const shippingEntity = new ShippingEntity();
  //   Object.assign(shippingEntity, requestBody.shipping_address);
  //   const orderEntity = new OrderEntity();
  //   orderEntity.shippingAddress = shippingEntity;
  //   orderEntity.user = currentUser;
  //   const orderTbl = await this.orderRepo.save(orderEntity);
  //   let opEntity: {
  //     order: OrderEntity;
  //     product: ProductEntity;
  //     product_quantity: number;
  //     product_unit_price: number;
  //   }[] = [];
  //   for (let i = 0; i < requestBody.order_products.length; i++) {
  //     const order = orderTbl;
  //     const product = await this.productService.findById(
  //       requestBody.order_products[i].id,
  //     );
  //     const product_quantity = requestBody.order_products[i].product_quantity;
  //     const product_unit_price = product.price * product_quantity;
  //     opEntity.push({
  //       order,
  //       product,
  //       product_quantity,
  //       product_unit_price,
  //     });
  //   }

  //   const op = await this.orderProductRepo
  //     .createQueryBuilder()
  //     .insert()
  //     .into(OrdersProductsEntity)
  //     .values(opEntity)
  //     .execute();
  //   return await this.findOne(orderTbl.id);
  // }

  // async getAll(): Promise<OrderEntity[]> {
  //   return await this.orderRepo.find({
  //     relations: {
  //       shippingAddress: true,
  //       user: true,
  //       products: { product: true },
  //     },
  //   });
  // }

  // async findOne(id: number): Promise<OrderEntity> {
  //   return await this.orderRepo.findOne({
  //     where: { id },
  //     relations: {
  //       shippingAddress: true,
  //       user: true,
  //       products: { product: true },
  //     },
  //   });
  // }

  // async findOneByProductId(id: number) {
  //   return await this.orderProductRepo.findOne({
  //     relations: { product: true },
  //     where: { product: { id: id } },
  //   });
  // }

  //   async findOneByOption(option: FindOptionsWhere<any>) {
  //     const product = await this.productRepo.findOneBy(option);
  //     return product;
  //   }

  //   async findById(id: number) {
  //     const product = await this.productRepo.findOne({
  //       where: { id: id },
  //       relations: {
  //         categories: true,
  //         users: true,
  //       },
  //     });
  //     if (!product) {
  //       throw new NotFoundException('sản phẩm không tồn tại');
  //     }
  //     return product;
  //   }

  // async updateById(
  //   id: number,
  //   requestBody: UpdateOrderStatusDto,
  //   currentUser: UserEntity,
  // ): Promise<OrderEntity> {
  //   {
  //     let order = await this.findOne(id);
  //     if (!order) throw new NotFoundException('không có order này');

  //     if (
  //       order.status === OrderStatus.DELIVERED ||
  //       order.status === OrderStatus.CANCELLED
  //     ) {
  //       throw new BadRequestException(`đơn hàng ${order.status}`);
  //     }
  //     if (
  //       order.status === OrderStatus.PROCESSING &&
  //       requestBody.status != OrderStatus.SHIPPED
  //     ) {
  //       throw new BadRequestException(`
  //       Giao hàng trước khi vận chuyển!!!`);
  //     }
  //     if (
  //       requestBody.status === OrderStatus.SHIPPED &&
  //       order.status === OrderStatus.SHIPPED
  //     ) {
  //       return order;
  //     }
  //     if (requestBody.status === OrderStatus.SHIPPED) {
  //       order.shippedAt = new Date();
  //     }
  //     if (requestBody.status === OrderStatus.DELIVERED) {
  //       order.deliveredAt = new Date();
  //     }
  //     order.status = requestBody.status;
  //     order.updatedBy = currentUser;
  //     order = await this.orderRepo.save(order);
  //     if (requestBody.status === OrderStatus.DELIVERED) {
  //       await this.stockUpdate(order, OrderStatus.DELIVERED);
  //     }
  //     return order;
  //   }
  // }
  // async stockUpdate(order: OrderEntity, status: string) {
  //   for (const op of order.products) {
  //     await this.productService.updateStock(
  //       op.product.id,
  //       op.product_quantity,
  //       status,
  //     );
  //   }
  // }
  // async cancelled(id: number, currentUser: UserEntity) {
  //   let order = await this.findOne(id);
  //   if (!order) throw new NotFoundException('không có order này');
  //   if (order.status === OrderStatus.DELIVERED)
  //     throw new BadRequestException('đơn hàng đã giao không thể hủy');
  //   if (order.status === OrderStatus.CANCELLED) return order;

  //   order.status = OrderStatus.CANCELLED;
  //   order.updatedBy = currentUser;
  //   order = await this.orderRepo.save(order);
  //   await this.stockUpdate(order, OrderStatus.CANCELLED);
  //   return order;
  // }

  // async deleteOrder(id: number) {
  //   let order = await this.findOne(id);
  //   if (!order) {
  //     throw new NotFoundException('không có order này');
  //   }
  //   return this.orderRepo.remove(order);
  // }
}
