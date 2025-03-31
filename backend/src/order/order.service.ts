import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto, currentUserId: number) {
        if (createOrderDto.userId !== currentUserId) throw new ForbiddenException('You can only create orders for yourself');

        const cart = await this.cartService.getCart(createOrderDto.userId, currentUserId);
        if (cart.items.length === 0) throw new NotFoundException('Cart is empty');

        const orderItems = cart.items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
        }));

        const order = await this.prisma.order.create({
            data: {
                userId: createOrderDto.userId,
                total: cart.total,
                items: {
                    create: orderItems,
                },
            },
            include: { items: true },
        });

        await this.cartService.clearCart(createOrderDto.userId, currentUserId);

        return order;
    }

    async getOrders(userId: number, currentUserId: number) {
        if (userId !== currentUserId) throw new ForbiddenException('You can only view your own orders');
    
        return this.prisma.order.findMany({
          where: { userId },
          include: {
            items: {
              include: { product: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      }
}
