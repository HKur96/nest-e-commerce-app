import { ApiResponse } from '@/utils/response/api.response';
import { CreateWishlistDto } from '../dtos/createWishlist.dto';

export interface WishlistRepositoryInterface {
  createWishlist(dto: CreateWishlistDto): Promise<ApiResponse<boolean>>;
}
