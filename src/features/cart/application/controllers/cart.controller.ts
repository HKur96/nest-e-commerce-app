import { AuthGuard } from '@/utils/guards/auth.guard';
import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { CartUseCase } from '../../data/use-cases/cart.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AddToCart } from '../../domains/dtos/createCart.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartUseCase: CartUseCase) {}

  @ApiCreatedResponse({ description: 'Cart successfully created' })
  @Post('/create')
  @Roles(Role.USER)
  createCart(@Query() dto: AddToCart): Promise<ApiResponseDto<boolean>> {
    return this.cartUseCase.addToCart(dto);
  }
}
