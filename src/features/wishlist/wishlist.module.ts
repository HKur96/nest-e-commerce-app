import { PrismaModule } from '@/infra/config/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { WishlistController } from './application/controllers/wishlist.controller';
import { WishlistRepository } from './data/repositories/wishlist.repository';
import { WishlistUseCase } from './data/use-cases/wishlist.usecase';

@Module({
  imports: [PrismaModule],
  controllers: [WishlistController],
  providers: [WishlistRepository, WishlistUseCase],
})
export class WishlistModule {}
