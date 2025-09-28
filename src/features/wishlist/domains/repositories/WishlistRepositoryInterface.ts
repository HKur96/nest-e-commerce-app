import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { CreateWishlistDto } from '../dtos/createWishlist.dto';

export interface WishlistRepositoryInterface {
  createWishlist(dto: CreateWishlistDto): Promise<ApiResponseDto<boolean>>;
}
