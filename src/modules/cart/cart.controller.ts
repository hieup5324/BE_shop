import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
    const usserId = req.user.id;
    return await this.cartService.getCart(usserId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async addToCart(@Request() req, @Body() dto: AddToCartDto) {
    const userId = req.user.id;
    return this.cartService.addToCart(userId, dto);
  }

  @Delete('/:productId')
  @UseGuards(AuthGuard)
  async removeFromCart(@Request() req, @Param('productId') productId: number) {
    const userId = req.user.id;
    return this.cartService.removeFromCart(userId, productId);
  }
}
