import { Injectable } from '@nestjs/common';
import { WishlistRepositoryInterface } from '../../domains/repositories/WishlistRepositoryInterface';
import { ApiResponse } from '@/utils/response/api.response';
import { CreateWishlistDto } from '../../domains/dtos/createWishlist.dto';
import { PrismaService } from '@/infra/config/prisma/prisma.service';

@Injectable()
export class WishlistRepository implements WishlistRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createWishlist({
    user_id,
    product_id,
  }: CreateWishlistDto): Promise<ApiResponse<boolean>> {
    try {
      // Ensure product exists
      const product = await this.prisma.product.findUnique({
        where: { id: product_id },
      });
      
      if (!product) {
        return ApiResponse.error('Product not found', 404);
      }

      // Upsert wishlist (create if not exists)
      const wishlist = await this.prisma.wishlist.upsert({
        where: { userId: user_id },
        update: {},
        create: {
          userId: user_id,
        },
      });

      // Check if product already in wishlist
      const existingItem = await this.prisma.wishlistItem.findFirst({
        where: { wishlistId: wishlist.id, productId: product_id },
      });

      if (!existingItem) {
        await this.prisma.wishlistItem.create({
          data: {
            wishlistId: wishlist.id,
            productId: product_id,
          },
        });
      }

      return ApiResponse.success('Success create a wishlist', true);
    } catch (error) {
      return ApiResponse.error('Unhandled exception');
    }
  }
}
