import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { AddToCart } from '../dtos/createCart.dto';

export interface CartRepositoryInterface {
  addToCart(dto: AddToCart): Promise<ApiResponseDto<boolean>>;
}
