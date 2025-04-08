import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AddToCartDto } from './dto/add-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCart(@Request() req) {
    const usserId = req.currentUser.id;
    return await this.cartService.getCart(usserId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    const userId = req.currentUser.id;
    return this.cartService.addToCart(userId, dto);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateCartItem(@Request() req, @Body() dto: any) {
    const userId = req.currentUser.id;
    return this.cartService.updateCartItem(userId, dto.productId, dto.quantity);
  }

  @Delete('/:productId')
  @UseGuards(AuthGuard)
  async removeFromCart(@Request() req, @Param('productId') productId: number) {
    const userId = req.currentUser.id;
    return this.cartService.removeFromCart(userId, productId);
  }
}
