import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { AddToCart } from '../../domains/dtos/addCart.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { CartResponse } from '../../domains/response/cart.response';
import { UpdateCartDto } from '../../domains/dtos/updateCart.dto';
import { UserData } from '@/utils/decorators/user.decorator';

@Injectable()
export class CartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async addToCart(dto: AddToCart): Promise<ApiResponseDto<boolean>> {
    return this.cartRepository.addToCart(dto);
  }

  async getCartByUserId(id: number): Promise<ApiResponseDto<CartResponse[]>> {
    return await this.cartRepository.getCartByUserId(id);
  }

  async updateCartQuantity(
    idProduct: number,
    dto: UpdateCartDto,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.cartRepository.updateCartQuantity(idProduct, dto, user);
  }
}
