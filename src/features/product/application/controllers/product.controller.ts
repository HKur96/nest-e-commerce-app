import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductUseCase } from '../../data/use-cases/product.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponse } from '@/utils/response/api.response';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import { CreateReviewDto } from '../../domains/dtos/createReview.dto';
import { ReviewResponse } from '../../domains/responses/review.response';

@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @Post('/create')
  @Roles(Role.SELLER)
  createProduct(
    @Body() dto: CreateProductDto,
    @User() user: UserData,
  ): Promise<ApiResponse<ProductResponse>> {
    return this.productUseCase.createProduct(user.role, dto);
  }

  @Get('/search')
  searchProduct(
    @Query() dto: SearchProductDto,
  ): Promise<ApiResponse<ProductResponse[]>> {
    return this.productUseCase.searchProduct(dto);
  }

  @Post('/reviews')
  @Roles(Role.BUYER)
  createReview(@Body() dto: CreateReviewDto): Promise<ApiResponse> {
    return this.productUseCase.createReview(dto);
  }

  @Get('/reviews/:id')
  getProductReviewById(
    @Param('id', ParseIntPipe) productId: number,
  ): Promise<ApiResponse<ReviewResponse[]>> {
    return this.productUseCase.getProductReviewById(productId);
  }
}
