import { UserData } from '@/utils/decorators/user.decorator';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { WishlistResponse } from '../wishlist.response';

export interface WishlistRepositoryInterface {
  createWishlist(
    idProduct: number,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>>;

  getWishlistByUserId(
    user: UserData,
  ): Promise<ApiResponseDto<WishlistResponse[]>>;

  deleteWishlistById(
    idProduct: number,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>>;
}
