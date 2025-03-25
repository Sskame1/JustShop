import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './cart-item.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { User } from 'src/auth/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard' 

@Controller('user/:userId/cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async getCart(
    @User() user: { id: number },
    @Param('userId') userId: number,
  ) {
    return this.cartService.getCart(userId);
  }

  @Post()
  async addToCart(
    @Param('userId') userId: number,
    @Body() item: CartItemDto,
  ) {
    return this.cartService.addToCart(userId, item);
  }

  @Delete('item/:productId')
  async removeFromCart(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartService.removeFromCart(userId, productId);
  }

  @Delete()
  async clearCart(@Param('userId') userId: number) {
    return this.cartService.clearCart(userId);
  }
}
