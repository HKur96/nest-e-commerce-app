import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto } from '../../domains/dtos/createOrder.dto';
import { UserData } from '@/utils/decorators/user.decorator';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { OrderResponse } from '../../domains/response/order.response';
import { OrderDetailResponse } from '../../domains/response/orderDetail.response';
import { UpdateOrderDto } from '../../domains/dtos/updateOrder.dto';

@Injectable()
export class OrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(
    dto: CreateOrderDto,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.orderRepository.createOrder(dto, user);
  }

  async getAllOrders(user: UserData): Promise<ApiResponseDto<OrderResponse[]>> {
    return await this.orderRepository.getAllOrders(user);
  }

  async getOrderDetail(
    id: number,
    user: UserData,
  ): Promise<ApiResponseDto<OrderDetailResponse>> {
    return await this.orderRepository.getOrderDetail(id, user);
  }

  async updateOrderById(
    orderId: number,
    dto: UpdateOrderDto,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.updateOrderById(orderId, dto);
  }
}
