import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { AddToCart } from '../dtos/addCart.dto';
import { CartResponse } from '../response/cart.response';
import { UpdateCartDto } from '../dtos/updateCart.dto';
import { UserData } from '@/utils/decorators/user.decorator';

export interface CartRepositoryInterface {
  addToCart(dto: AddToCart): Promise<ApiResponseDto<boolean>>;

  getCartByUserId(id: number): Promise<ApiResponseDto<CartResponse[]>>;

  updateCartQuantity(
    idProduct: number,
    dto: UpdateCartDto,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>>;
}
