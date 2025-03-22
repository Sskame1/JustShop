import { Body, Controller, Post, UseGuards, Get, Param, ParseIntPipe, Patch, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { CreateProductDto } from './create-product.dto';
import { UpdateProductDto } from './update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @Roles('ADMIN', 'SELLER')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @UseGuards(RolesGuard)
  async create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)'}),
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }) // limit on 5mb
        ]
      }),
    )
    image: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    const createDto = {
      ...createProductDto,
      image: `./uploads/${image.filename}`
    }

    return this.productService.create(createDto);
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
