import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/roles.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SELLER)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @User() user: { userId: number }
  ) {
    return this.orderService.createOrder(createOrderDto, user.userId);
  }

  @Get(':userId')
  @Roles(UserRole.USER, UserRole.ADMIN, UserRole.SELLER)
  getOrders(
    @Param('userId') userId: string,
    @User() user: { userId: number },
  ) {
    return this.orderService.getOrders(parseInt(userId), user.userId);
  }
}
