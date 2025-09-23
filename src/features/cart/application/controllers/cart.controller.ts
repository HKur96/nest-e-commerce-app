import { AuthGuard } from '@/utils/guards/auth.guard';
import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { CartUseCase } from '../../data/use-cases/cart.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { AddToCart } from '../../domains/dtos/createCart.dto';
import { ApiResponse } from '@/utils/response/api.response';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartUseCase: CartUseCase) {}

  @Post('/create')
  @Roles(Role.BUYER)
  createCart(@Query() dto: AddToCart): Promise<ApiResponse<boolean>> {
    return this.cartUseCase.addToCart(dto);
  }
}
