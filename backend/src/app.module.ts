import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthModule, UserModule, ProductModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
