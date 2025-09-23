import { PrismaModule } from '@/infra/config/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { CartController } from './application/controllers/cart.controller';
import { CartRepository } from './data/repositories/cart.repository';
import { CartUseCase } from './data/use-cases/cart.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [CartController],
  providers: [CartRepository, CartUseCase],
})
export class CartModule {}
