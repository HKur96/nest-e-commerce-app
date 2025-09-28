import { AuthGuard } from '@/utils/guards/auth.guard';
import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { WishlistUseCase } from '../../data/use-cases/wishlist.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { CreateWishlistDto } from '../../domains/dtos/createWishlist.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistUseCase: WishlistUseCase) {}

  @ApiCreatedResponse({ description: 'Wishlist successfully created' })
  @Post('/create')
  @Roles(Role.USER)
  createWishlist(
    @Query() dto: CreateWishlistDto,
  ): Promise<ApiResponseDto<boolean>> {
    return this.wishlistUseCase.createWishlist(dto);
  }
}
