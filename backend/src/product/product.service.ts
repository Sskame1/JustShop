import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './create-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) {}

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: createProductDto,
        });
    }

    async findAll() {
        return this.prisma.product.findMany();
    }

    
}
