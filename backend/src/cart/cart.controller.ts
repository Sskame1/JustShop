import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItemDto } from './dto/cart-item.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard' 

@Controller('user/:userId/cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get()
  async getCart(
    @User() user: { id: number },
    @Param('userId') userId: number,
  ) {
    return this.cartService.getCart(Number(userId), user.id);
  }

  @Post()
  async addToCart(
    @User() user: { id: number },
    @Param('userId') userId: number,
    @Body() item: CartItemDto,
  ) {
    return this.cartService.addToCart(Number(userId), item, user.id);
  }

  @Delete('item/:productId')
  async removeFromCart(
    @User() user: { id: number },
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ) {
    return this.cartService.removeFromCart(Number(userId), productId, user.id);
  }

  @Delete()
  async clearCart(
    @Param('userId') userId: number,
    @User() user: { id: number },
  ) {
    return this.cartService.clearCart(Number(userId), user.id);
  }
}
