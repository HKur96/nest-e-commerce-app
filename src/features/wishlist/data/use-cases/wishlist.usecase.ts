import { Injectable } from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { CreateWishlistDto } from '../../domains/dtos/createWishlist.dto';

@Injectable()
export class WishlistUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async createWishlist(dto: CreateWishlistDto): Promise<ApiResponseDto<boolean>> {
    return this.wishlistRepository.createWishlist(dto);
  }
}
