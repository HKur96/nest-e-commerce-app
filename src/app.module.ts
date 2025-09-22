import { Module } from '@nestjs/common';
import { UserModule } from './features/user/user.module';
import { PrismaModule } from './infra/config/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AddressModule } from './features/address/address.module';

@Module({
  imports: [
    UserModule,
    AddressModule,
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
