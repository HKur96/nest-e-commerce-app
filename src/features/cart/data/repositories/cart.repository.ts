import { Injectable } from '@nestjs/common';
import { CartRepositoryInterface } from '../../domains/repositories/CartRepositoryInterface';
import { ApiResponse } from '@/utils/response/api.response';
import { AddToCart } from '../../domains/dtos/createCart.dto';
import { PrismaService } from '@/infra/config/prisma/prisma.service';

@Injectable()
export class CartRepository implements CartRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async addToCart({
    user_id,
    product_id,
    quantity,
  }: AddToCart): Promise<ApiResponse<boolean>> {
    try {
      const qtt = quantity ?? 1;
      const product = await this.prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        return ApiResponse.error('Product not found', 404);
      }

      // Upsert cart (create if not exists)
      const cart = await this.prisma.cart.upsert({
        where: { userId: user_id },
        update: {},
        create: {
          userId: user_id,
        },
      });

      // Check if product already in cart
      const existingItem = await this.prisma.cartItem.findFirst({
        where: { cartId: cart.id, productId: product_id },
      });

      if (existingItem) {
        // Increase quantity if exists
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + qtt },
        });
      } else {
        // Create new cart item
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product_id,
            quantity: qtt,
          },
        });
      }

      return ApiResponse.success('Success add to cart', true);
    } catch (error) {
      return ApiResponse.error('Unexpected error');
    }
  }
}
