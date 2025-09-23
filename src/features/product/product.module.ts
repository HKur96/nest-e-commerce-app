import { PrismaModule } from '@/infra/config/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ProductController } from './application/controllers/product.controller';
import { ProductRepository } from './data/repositories/product.repository';
import { ProductUseCase } from './data/use-cases/product.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductRepository, ProductUseCase],
})
export class ProductModule {}
