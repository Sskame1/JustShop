import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemDto } from './dto/cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) { }

  private async validateCartOwner(userId: number, targetUserId: number) {
    if (userId !== targetUserId) throw new ForbiddenException('You can only access your own cart')
  }

  private async getCartOrCreate(userId: number) {
    return this.prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: { items: true },
    });
  }

  async getCart(userId: number, currentUserId: number) {
    await this.validateCartOwner(currentUserId, userId);

    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              }
            }
          }
        },
      }
    });

    if (!cart) throw new NotFoundException('Cart not found');

    const total = cart.items.reduce(
    (sum, item) => sum + (item.product.price * item.quantity), 0
    );
    return { ...cart, total };
  }

  async addToCart(userId: number, item: CartItemDto, currentUserId: number) {
    await this.validateCartOwner(currentUserId, userId)

    const product = await this.prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

    if (item.quantity > 99) throw new ForbiddenException('Maximum quantity per product is 99');

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
        quantity: Math.min(item.quantity, 99),
      },
      update: {
        quantity: {
          increment: Math.min(item.quantity, 99),
        },
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true
          }
        }
      }
    });
  }

  async removeFromCart(userId: number, productId: number, currentUserId: number) {
    await this.validateCartOwner(currentUserId, userId)
    const cart = await this.prisma.cart.findUnique({  where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    return this.prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: productId,
        },
      },
    });
  }

  async clearCart(userId: number, currentUserId: number) {
    await this.validateCartOwner(currentUserId, userId);

    const cart = await this.prisma.cart.findUnique({ where: { userId } });
    if (!cart) throw new NotFoundException('Cart not found');

    return this.prisma.cart.update({
      where: { userId },
      data: { items: { deleteMany: {} } },
      include: {
        items: {
          select: {
            productId: true
          }
        }
      }
    });
  }
}