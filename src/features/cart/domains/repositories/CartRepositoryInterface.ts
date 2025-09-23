import { ApiResponse } from '@/utils/response/api.response';
import { AddToCart } from '../dtos/createCart.dto';

export interface CartRepositoryInterface {
  addToCart(dto: AddToCart): Promise<ApiResponse<boolean>>;
}
