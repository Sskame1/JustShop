import { Body, Controller, Post, UseGuards, Get, Param, ParseIntPipe, Patch, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'multer'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Roles('ADMIN', 'SELLER')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(RolesGuard)
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productService.create({
      ...createProductDto,
      image: image.buffer,
    });
  }

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'SELLER')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateProducDto: UpdateProductDto,
  ) {
    return this.productService.update(id, {
      ...updateProducDto,
      image: image?.buffer,
    });
  }

  @Delete(':id')
  @Roles('ADMIN', 'SELLER')
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
