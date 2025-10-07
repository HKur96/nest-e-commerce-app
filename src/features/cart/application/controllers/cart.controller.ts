import { AuthGuard } from '@/utils/guards/auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartUseCase } from '../../data/use-cases/cart.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AddToCart } from '../../domains/dtos/addCart.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import {
  ApiTags,
  ApiQuery,
  ApiResponse,
  ApiParam,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CartResponse } from '../../domains/response/cart.response';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { UpdateCartDto } from '../../domains/dtos/updateCart.dto';

@ApiTags('Cart')
@ApiBearerAuth('access-token')
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartUseCase: CartUseCase) {}

  @ApiOperation({ summary: 'Endpoint to create a cart by user id' })
  @ApiQuery({ name: 'user_id', required: true, type: Number })
  @ApiQuery({ name: 'product_id', required: true, type: Number })
  @ApiQuery({ name: 'quantity', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Cart successfully created',
    type: Boolean,
  })
  @Roles(Role.USER)
  @Post('/create')
  createCart(@Query() dto: AddToCart): Promise<ApiResponseDto<boolean>> {
    return this.cartUseCase.addToCart(dto);
  }

  @ApiOperation({ summary: 'Endpoint to get a cart by user id' })
  @ApiResponse({
    status: 200,
    description: 'Cart successfully got',
    type: CartResponse,
    isArray: true,
  })
  @Roles(Role.USER)
  @Get()
  async getCartByUserId(
    @User() user: UserData,
  ): Promise<ApiResponseDto<CartResponse[]>> {
    return await this.cartUseCase.getCartByUserId(user.id);
  }

  @ApiOperation({ summary: 'Endpoint to update a cart by user id' })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product',
    type: 'string',
  })
  @Roles(Role.USER)
  @Put('/update/:id')
  async updateCartQuantity(
    @Param('id', ParseIntPipe) idProduct: number,
    @User() user: UserData,
    @Body() dto: UpdateCartDto,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.cartUseCase.updateCartQuantity(idProduct, dto, user);
  }
}
