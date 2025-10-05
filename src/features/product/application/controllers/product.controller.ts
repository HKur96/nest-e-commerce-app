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
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import {
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger';
import { CategoryResponse } from '../../domains/responses/category.response';
import { DetailProductResponse } from '../../domains/responses/detailProduct.response';

@ApiTags('Product')
@Controller('product')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(private readonly productUseCase: ProductUseCase) {}

  @ApiOperation({ summary: 'Endpoint to create an order' })
  @Roles(Role.SELLER)
  @ApiResponse({
    status: 200,
    description: 'Product successfully created',
    type: ProductResponse,
    isArray: true,
  })
  @Post('/create')
  createProduct(
    @Body() dto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>> {
    return this.productUseCase.createProduct(dto);
  }

  @ApiOperation({ summary: 'Endpoint to search product' })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'sortBy', required: false, enum: ['price', 'review'] })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Product successfully searched',
    type: ProductResponse,
    isArray: true,
  })
  @Get('/search')
  searchProduct(
    @Query() dto: SearchProductDto,
  ): Promise<ApiResponseDto<ProductResponse[]>> {
    return this.productUseCase.searchProduct(dto);
  }

  @ApiOperation({ summary: 'Endpoint to get categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories successfully got',
    type: CategoryResponse,
    isArray: true,
  })
  @Get('/category')
  getAllCategories(): Promise<ApiResponseDto<CategoryResponse[]>> {
    return this.productUseCase.getAllCategories();
  }

  @ApiOperation({ summary: 'Endpoint to get detail product by id' })
  @ApiResponse({
    status: 200,
    description: 'Detail product successfully got',
    type: DetailProductResponse,
  })
  @Get('/:id')
  getDetailProduct(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponseDto<DetailProductResponse>> {
    return this.productUseCase.getDetailProduct(id);
  }
}
