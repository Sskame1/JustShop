import { Body, Controller, Post, UseGuards, Get, Param, ParseIntPipe, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Roles('ADMIN', 'SELLER')
  @UseGuards(RolesGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProducDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProducDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'SELLER')
  @UseGuards(RolesGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
