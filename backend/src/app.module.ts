import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { PassportModule } from '@nestjs/passport';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    AuthModule,
    PassportModule.register({ session: false }),
    UserModule,
    ProductModule,
    CartModule,
    OrderModule
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }
