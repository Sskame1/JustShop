import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto) {
        return this.prisma.product.create({
            data: {
                ...createProductDto,
                image: createProductDto.image,
            },
        });
    }

    async findAll() {
        return this.prisma.product.findMany();
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`)
        }
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`)
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                ...updateProductDto,
                image: updateProductDto.image,
            },
        });
    }

    async remove(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`)
        }

        return this.prisma.product.delete({
            where: { id },
        });
    }
}
