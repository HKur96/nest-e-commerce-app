import { AuthGuard } from '@/utils/guards/auth.guard';
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishlistUseCase } from '../../data/use-cases/wishlist.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import {
  ApiTags,
  ApiParam,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { WishlistResponse } from '../../domains/wishlist.response';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistUseCase: WishlistUseCase) {}

  @ApiOperation({ summary: 'Endpoint to create a wishlist' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, type: Boolean })
  @Roles(Role.USER)
  @Post('/create/:id')
  async createWishlist(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.wishlistUseCase.createWishlist(id, user);
  }

  @ApiOperation({ summary: 'Endpoint to get array of wishlist' })
  @ApiResponse({
    status: 200,
    type: WishlistResponse,
    isArray: true,
  })
  @Roles(Role.SELLER, Role.USER)
  @Get()
  async getWishlistByUserId(
    @User() user: UserData,
  ): Promise<ApiResponseDto<WishlistResponse[]>> {
    return await this.wishlistUseCase.getWishlistByUserId(user);
  }

  @ApiOperation({ summary: 'Endpoint to delete wishlist by product id' })
  @ApiResponse({
    status: 200,
    type: Boolean,
  })
  @Roles(Role.USER)
  @Delete('/:id')
  async deleteWishlistById(
    @Param('id', ParseIntPipe) idProduct: number,
    @User() user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.wishlistUseCase.deleteWishlistById(idProduct, user);
  }
}
