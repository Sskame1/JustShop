import { Body, Controller, Post, UseGuards, Get, Param, ParseIntPipe, Patch, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { UserRole } from 'src/auth/roles.enum';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ]
      })
    ) image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @User() user: { id: number }
  ) {
    return this.productService.create({
      ...createProductDto,
      image: `./uploads/${image.filename}`,
      sellerId: user.id
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
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateProducDto: UpdateProductDto,
    @User() user: { id: number }
  ) {
    return this.productService.update(id, {
      ...updateProducDto,
      image: `/uploads/${image.filename}`,
    }, user.id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SELLER)
  @UseGuards(RolesGuard)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: { id: number }
  ) {
    return this.productService.remove(id, user.id);
  }
}
