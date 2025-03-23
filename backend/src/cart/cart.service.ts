import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartItemDto } from './cart-item.dto';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) { }

    async getCart(userId: number) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
    }

    async addToCart(userId: number, item: CartItemDto) {
        const cart = await this.prisma.cart.upsert({
            where: { userId },
            create: { userId, items: { create: [item] } },
            update: {
                items: {
                    upsert: {
                        where: { productId_cartId: { productId: item.productId, cartId: (await this.getCart(userId)).id } },
                        create: item,
                        update: { quantity: { increment: item.quantity } },
                    },
                },
            },
        });
        return cart;
    }

    async removeFromCart(userId: number, productId: number) {
        const cart = await this.getCart(userId);
        return this.prisma.cartItem.delete({
            where: { productId_cartId: { productId, cartId: cart.id } },
        });
    }

    async clearCart(userId: number) {
        const cart = await this.getCart(userId);
        return this.prisma.cart.update({
            where: { userId },
            data: { items: { deleteMany: {} } },
        });
    }
}
