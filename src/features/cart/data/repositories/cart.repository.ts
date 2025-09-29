import { Injectable } from '@nestjs/common';
import { CartRepositoryInterface } from '../../domains/repositories/CartRepositoryInterface';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { AddToCart } from '../../domains/dtos/addCart.dto';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { CartResponse } from '../../domains/response/cart.response';
import { UpdateCartDto } from '../../domains/dtos/updateCart.dto';
import { UserData } from '@/utils/decorators/user.decorator';

@Injectable()
export class CartRepository implements CartRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async updateCartQuantity(
    idProduct: number,
    { quantity }: UpdateCartDto,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    try {
      // Check if cart item exists
      const cartItem = await this.prisma.cart.findUnique({
        where: { userId_productId: { userId: user.id, productId: idProduct } },
      });

      if (!cartItem) {
        return ApiResponseDto.error('Cart not found', 404);
      }

      if (quantity < 1) {
        // delete the cart row if quantity is less than 1
        await this.prisma.cart.delete({
          where: {
            userId_productId: { userId: user.id, productId: idProduct },
          },
        });

        return ApiResponseDto.success(
          'Cart item deleted because quantity < 1',
          true,
        );
      }

      // otherwise update quantity
      await this.prisma.cart.update({
        where: { userId_productId: { userId: user.id, productId: idProduct } },
        data: { quantity },
        include: { product: { include: { images: true } } },
      });

      return ApiResponseDto.success('Cart successfully updated', true);
    } catch (error) {
      return ApiResponseDto.error(
        'Unexpected error while update cart quantity',
      );
    }
  }

  async getCartByUserId(id: number): Promise<ApiResponseDto<CartResponse[]>> {
    try {
      const carts = await this.prisma.cart.findMany({
        where: { userId: id },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              images: { select: { id: true, url: true } },
            },
          },
          user: { select: { id: true } },
        },
        orderBy: { id: 'desc' },
      });

      if (!carts.length) {
        return ApiResponseDto.error('Cart not found', 404);
      }

      return ApiResponseDto.success(
        'Cart successfully got',
        carts.map<CartResponse>((cart) => {
          return new CartResponse({
            id: cart.id,
            user_id: cart.userId,
            product_id: cart.product.id,
            product_name: cart.product.name,
            product_price: cart.product.price.toNumber(),
            product_quantity: cart.quantity,
            product_images: cart.product.images.map<string>((img) => img.url),
          });
        }),
      );
    } catch (error) {
      return ApiResponseDto.error('Unexpected error while get cart');
    }
  }

  async addToCart({
    user_id,
    product_id,
    quantity,
  }: AddToCart): Promise<ApiResponseDto<boolean>> {
    try {
      const qtt = quantity ?? 1;
      const product = await this.prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        return ApiResponseDto.error('Product not found', 404);
      }

      const cart = await this.prisma.cart.upsert({
        where: { userId_productId: { userId: user_id, productId: product_id } },
        update: {},
        create: { userId: user_id, productId: product_id, quantity: qtt },
        select: { id: true },
      });

      return ApiResponseDto.success('Success add to cart', !!cart);
    } catch (error) {
      return ApiResponseDto.error('Unexpected error');
    }
  }
}
