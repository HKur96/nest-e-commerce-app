import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ProductUseCase } from '../../data/use-cases/product.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import { ApiTags, ApiCreatedResponse } from '@nestjs/swagger';

@ApiTags('Product')
@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @ApiCreatedResponse({ description: 'Product successfully created' })
  @Post('/create')
  @Roles(Role.SELLER)
  createProduct(
    @Body() dto: CreateProductDto,
    @User() user: UserData,
  ): Promise<ApiResponseDto<ProductResponse>> {
    return this.productUseCase.createProduct(user.role, dto);
  }

  @ApiCreatedResponse({ description: 'Product successfully searched' })
  @Get('/search')
  searchProduct(
    @Query() dto: SearchProductDto,
  ): Promise<ApiResponseDto<ProductResponse[]>> {
    return this.productUseCase.searchProduct(dto);
  }
}
