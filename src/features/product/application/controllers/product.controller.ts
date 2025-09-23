import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProductUseCase } from '../../data/use-cases/product.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponse } from '@/utils/response/api.response';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';

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
}
