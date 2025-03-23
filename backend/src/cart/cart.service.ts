import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private prisma: PrismaService) {}

    async getCart(userId: number) {
        return this.prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } },
        });
    }
}
