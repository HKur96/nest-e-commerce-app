import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { AddToCart } from '../../domains/dtos/createCart.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';

@Injectable()
export class CartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async addToCart(dto: AddToCart): Promise<ApiResponseDto<boolean>> {
    return this.cartRepository.addToCart(dto);
  }
}
