import { Module } from '@nestjs/common';
import { UserModule } from './features/user/user.module';
import { PrismaModule } from './infra/config/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AddressModule } from './features/address/address.module';
import { ProductModule } from './features/product/product.module';
import { WishlistModule } from './features/wishlist/wishlist.module';

@Module({
  imports: [
    UserModule,
    AddressModule,
    ProductModule,
    WishlistModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
