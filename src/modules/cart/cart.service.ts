import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { CartItemRepository } from './cart-item.repository';
import { ProductService } from '../products/product.service';
import { AddToCartDto } from './dto/add-cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepo: CartRepository,
    private readonly cartItemRepo: CartItemRepository,
    private readonly productService: ProductService,
  ) {}
  async getCart(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.product'],
    });

    if (!cart) {
      throw new NotFoundException('Giỏ hàng trống');
    }

    return {
      cartId: cart.id,
      items: cart.cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.product_name,
        quantity: item.quantity,
        price: item.price,
      })),
    };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    const { product_id, quantity } = dto;
    let cart = await this.cartRepo.findOne({ where: { user: { id: userId } } });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: userId } });
      await this.cartRepo.save(cart);
    }

    const product = await this.productService.findById(product_id);
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    let cartItem = await this.cartItemRepo.findOne({
      where: { cart: { id: cart.id }, product: { id: product_id } },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.price = product.price * cartItem.quantity;
    } else {
      cartItem = this.cartItemRepo.create({
        cart,
        product,
        quantity,
        price: product.price * quantity,
      });
    }

    await this.cartItemRepo.save(cartItem);
    return { message: 'Đã thêm sản phẩm vào giỏ hàng', cartItem };
  }

  async removeFromCart(userId: number, productId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
    });
    if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');

    const cartItem = await this.cartItemRepo.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (!cartItem)
      throw new NotFoundException('Sản phẩm không có trong giỏ hàng');

    await this.cartItemRepo.delete(cartItem.id);
    return { message: 'Đã xóa sản phẩm khỏi giỏ hàng' };
  }
}
