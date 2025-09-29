import { PrismaModule } from '@/infra/config/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { OrderController } from './application/controllers/order.controller';
import { OrderRepository } from './data/repositories/order.repository';
import { OrderUseCase } from './data/use-cases/order.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [OrderController],
  providers: [OrderRepository, OrderUseCase],
})
export class OrderModule {}
