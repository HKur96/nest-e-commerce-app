import { Injectable } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.repository';
import { AddToCart } from '../../domains/dtos/createCart.dto';
import { ApiResponse } from '@/utils/response/api.response';

@Injectable()
export class CartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async addToCart(dto: AddToCart): Promise<ApiResponse<boolean>> {
    return this.cartRepository.addToCart(dto);
  }
}
