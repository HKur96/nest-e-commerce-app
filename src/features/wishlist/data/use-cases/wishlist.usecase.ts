import { Injectable } from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { ApiResponse } from '@/utils/response/api.response';
import { CreateWishlistDto } from '../../domains/dtos/createWishlist.dto';

@Injectable()
export class WishlistUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async createWishlist(dto: CreateWishlistDto): Promise<ApiResponse<boolean>> {
    return this.wishlistRepository.createWishlist(dto);
  }
}
