import { UserData } from '@/utils/decorators/user.decorator';
import { CreateOrderDto } from '../dtos/createOrder.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { OrderResponse } from '../response/order.response';
import { OrderDetailResponse } from '../response/orderDetail.response';
import { UpdateOrderDto } from '../dtos/updateOrder.dto';

export interface OrderRepositoryInterface {
  createOrder(
    dto: CreateOrderDto,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>>;

  getAllOrders(user: UserData): Promise<ApiResponseDto<OrderResponse[]>>;

  getOrderDetail(
    id: number,
    user: UserData,
  ): Promise<ApiResponseDto<OrderDetailResponse>>;

  updateOrderById(
    orderId: number,
    dto: UpdateOrderDto,
  ): Promise<ApiResponseDto<boolean>>;
}
