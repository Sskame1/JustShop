import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemDto } from './cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getCartOrCreate(userId: number) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { items: true },
    });
  }

  async getCart(userId: number) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }

  async addToCart(userId: number, item: CartItemDto) {
    const cart = await this.getCartOrCreate(userId);
    
    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: item.productId,
        },
      },
      create: {
        cartId: cart.id,
        productId: item.productId,
        quantity: item.quantity,
      },
      update: {
        quantity: {
          increment: item.quantity,
        },
      },
    });
  }

  async removeFromCart(userId: number, productId: number) {
    const cart = await this.getCart(userId);
    
    return this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
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