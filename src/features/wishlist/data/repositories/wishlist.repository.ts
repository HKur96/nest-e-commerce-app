import { Injectable } from '@nestjs/common';
import { WishlistRepositoryInterface } from '../../domains/repositories/WishlistRepositoryInterface';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { UserData } from '@/utils/decorators/user.decorator';
import { WishlistResponse } from '../../domains/wishlist.response';
import { Prisma } from '@prisma/client';

@Injectable()
export class WishlistRepository implements WishlistRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async deleteWishlistById(
    idProduct: number,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    try {
      await this.prisma.wishlist.delete({
        where: { userId_productId: { userId: user.id, productId: idProduct } },
      });

      return ApiResponseDto.success('Wishlist successfully deleted', true);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        // record not found
        return ApiResponseDto.error('Wishlist not found for this user/product');
      }

      return ApiResponseDto.error('Unexpected error while deleting wishlist');
    }
  }

  async getWishlistByUserId(
    user: UserData,
  ): Promise<ApiResponseDto<WishlistResponse[]>> {
    try {
      const wishlists = await this.prisma.wishlist.findMany({
        where: { userId: user.id },
        orderBy: { id: 'desc' },
        include: { product: { include: { images: true } } },
      });

      if (!wishlists.length) {
        return ApiResponseDto.error('Wishlist not found', 404);
      }

      return ApiResponseDto.success(
        'Wishlist successfully got',
        wishlists.map<WishlistResponse>((wishlist) => {
          return new WishlistResponse({
            user_id: user.id,
            product_id: wishlist.product.id,
            product_name: wishlist.product.name,
            product_price: wishlist.product.price.toNumber(),
            product_images: wishlist.product.images.map<string>((pr) => {
              return pr.url;
            }),
          });
        }),
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Unexpected error while get wishlist by user id',
      );
    }
  }

  async createWishlist(
    idProduct: number,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    try {
      // Ensure product exists
      const product = await this.prisma.product.findUnique({
        where: { id: idProduct },
      });

      if (!product) {
        return ApiResponseDto.error('Product not found', 404);
      }

      // Upsert wishlist (create if not exists)
      const wishlist = await this.prisma.wishlist.upsert({
        where: { id: idProduct },
        update: {},
        create: {
          userId: user.id,
          productId: idProduct,
        },
      });

      // Check if product already in wishlist
      const existingItem = await this.prisma.wishlist.findFirst({
        where: { id: wishlist.id, productId: idProduct },
      });

      if (!existingItem) {
        await this.prisma.wishlist.create({
          data: {
            id: wishlist.id,
            userId: user.id,
            productId: idProduct,
          },
        });
      }

      return ApiResponseDto.success('Success create a wishlist', true);
    } catch (error) {
      return ApiResponseDto.error('Unhandled exception');
    }
  }
}
