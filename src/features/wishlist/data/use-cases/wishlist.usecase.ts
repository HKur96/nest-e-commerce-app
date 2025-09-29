import { Injectable } from '@nestjs/common';
import { WishlistRepository } from '../repositories/wishlist.repository';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { UserData } from '@/utils/decorators/user.decorator';
import { WishlistResponse } from '../../domains/wishlist.response';

@Injectable()
export class WishlistUseCase {
  constructor(private readonly wishlistRepository: WishlistRepository) {}

  async createWishlist(
    idProduct: number,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.wishlistRepository.createWishlist(idProduct, user);
  }

  async getWishlistByUserId(
    user: UserData,
  ): Promise<ApiResponseDto<WishlistResponse[]>> {
    return await this.wishlistRepository.getWishlistByUserId(user);
  }

  async deleteWishlistById(
    idProduct: number,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.wishlistRepository.deleteWishlistById(idProduct, user);
  }
}
