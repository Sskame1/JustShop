import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto & { sellerId: number }) {
        return this.prisma.product.create({
            data: createProductDto,
            select: this.productSelectFields()
          });
    }

    async findAll() {
        return this.prisma.product.findMany({
            select: this.productSelectFields()
        });
    }

    async findOne(id: number) {
        const product = await this.prisma.product.findUnique({ where: { id }, select: this.productSelectFields() });

        if (!product) throw new NotFoundException(`Product with ID ${id} not found`)
        return product;
    }

    async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
        const product = await this.prisma.product.findUnique({ where: { id }, });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`)

        if (product.sellerId !== userId) throw new ForbiddenException('You can only update your own products')

        return this.prisma.product.update({ where: { id }, data: updateProductDto, select: this.productSelectFields() });
    }

    async remove(id: number, userId: number) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`)
        
        if (product.sellerId !== userId) throw new ForbiddenException('You can only delete your own products');

        return this.prisma.product.delete({ where: { id }, select: { id: true, name: true }});
    }

    private productSelectFields() {
        return {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          seller: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        };
      }
}
