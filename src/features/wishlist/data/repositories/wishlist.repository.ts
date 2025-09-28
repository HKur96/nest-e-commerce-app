import { Injectable } from '@nestjs/common';
import { WishlistRepositoryInterface } from '../../domains/repositories/WishlistRepositoryInterface';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { CreateWishlistDto } from '../../domains/dtos/createWishlist.dto';
import { PrismaService } from '@/infra/config/prisma/prisma.service';

@Injectable()
export class WishlistRepository implements WishlistRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createWishlist({
    user_id,
    product_id,
  }: CreateWishlistDto): Promise<ApiResponseDto<boolean>> {
    try {
      // Ensure product exists
      const product = await this.prisma.product.findUnique({
        where: { id: product_id },
      });
      
      if (!product) {
        return ApiResponseDto.error('Product not found', 404);
      }

      // Upsert wishlist (create if not exists)
      const wishlist = await this.prisma.wishlist.upsert({
        where: { id: product_id },
        update: {},
        create: {
          userId: user_id,
          productId: product_id,
        },
      });

      // Check if product already in wishlist
      const existingItem = await this.prisma.wishlist.findFirst({
        where: { id: wishlist.id, productId: product_id },
      });

      if (!existingItem) {
        await this.prisma.wishlist.create({
          data: {
            id: wishlist.id,
            userId: user_id,
            productId: product_id,
          },
        });
      }

      return ApiResponseDto.success('Success create a wishlist', true);
    } catch (error) {
      return ApiResponseDto.error('Unhandled exception');
    }
  }
}
