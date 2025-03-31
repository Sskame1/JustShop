import { Injectable } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private cartService: CartService,
    ) {}

    
}
