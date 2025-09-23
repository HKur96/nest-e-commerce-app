import { AuthGuard } from '@/utils/guards/auth.guard';
import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { WishlistUseCase } from '../../data/use-cases/wishlist.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { CreateWishlistDto } from '../../domains/dtos/createWishlist.dto';
import { ApiResponse } from '@/utils/response/api.response';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistUseCase: WishlistUseCase) {}

  @Post('/create')
  @Roles(Role.BUYER)
  createWishlist(
    @Query() dto: CreateWishlistDto,
  ): Promise<ApiResponse<boolean>> {
    return this.wishlistUseCase.createWishlist(dto);
  }
}
