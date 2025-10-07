import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductUseCase } from '../../data/use-cases/product.usecase';
import { Roles } from '@/utils/decorators/role.decorator';
import { CollectionType, Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import { ApiTags, ApiResponse, ApiQuery, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryResponse } from '../../domains/responses/category.response';
import { DetailProductResponse } from '../../domains/responses/detailProduct.response';
import { CreateCollectionDto } from '../../domains/dtos/createCollection.dto';

@ApiTags('Product')
@ApiBearerAuth('access-token')
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

  @ApiOperation({ summary: 'Endpoint to create product collection' })
  @ApiBody({type: CreateCollectionDto, required: true})
  @ApiResponse({
    status: 200,
    description: 'Product collection successfully created',
    type: Boolean,
  })
  @Post('/product/collection')
  async createProductCollection(
    dto: CreateCollectionDto,
  ): Promise<ApiResponseDto<boolean>> {
    return this.productUseCase.createProductCollection(dto);
  }

  @ApiOperation({ summary: 'Endpoint to get product collection by type' })
  @ApiResponse({
    status: 200,
    description: 'Product collection successfully got',
    type: ProductResponse,
    isArray: true,
  })
  @Get('/product/collection')
  async getProductCollections(
    type: CollectionType,
  ): Promise<ApiResponseDto<ProductResponse[]>> {
    return this.productUseCase.getProductCollections(type);
  }
}
