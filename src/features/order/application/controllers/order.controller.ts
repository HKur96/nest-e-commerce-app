import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrderUseCase } from '../../data/use-cases/order.usecase';
import { AuthGuard } from '@/utils/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from '../../domains/dtos/createOrder.dto';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { OrderResponse } from '../../domains/response/order.response';
import { OrderDetailResponse } from '../../domains/response/orderDetail.response';
import { UpdateOrderDto } from '../../domains/dtos/updateOrder.dto';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';

@ApiTags('Order')
@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderUseCase: OrderUseCase) {}

  @ApiOperation({ summary: 'Endpoint to create an order' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles(Role.USER)
  @Post()
  async createOrder(
    @Body() dto: CreateOrderDto,
    @User() user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.orderUseCase.createOrder(dto, user);
  }

  @ApiOperation({ summary: 'Endpoint to get all orders' })
  @ApiOkResponse({
    description: 'List of all orders for the current user',
    type: OrderResponse,
    isArray: true,
  })
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @Get()
  async getAllOrders(
    @User() user: UserData,
  ): Promise<ApiResponseDto<OrderResponse[]>> {
    return await this.orderUseCase.getAllOrders(user);
  }

  @ApiOperation({ summary: 'Endpoint to get order detail by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, type: OrderDetailResponse })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @Get('/:id')
  async getOrderDetail(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserData,
  ): Promise<ApiResponseDto<OrderDetailResponse>> {
    return await this.orderUseCase.getOrderDetail(id, user);
  }

  @ApiOperation({ summary: 'Endpoint to update order by id' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateOrderDto })
  @Roles(Role.ADMIN)
  @Put('/:id')
  async updateOrderById(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderDto,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.orderUseCase.updateOrderById(id, dto);
  }
}
