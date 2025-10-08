import { CreateProductDto } from '../dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../responses/product.response';
import { SearchProductDto } from '../dtos/searchProduct.dto';
import { CategoryResponse } from '../responses/category.response';
import { DetailProductResponse } from '../responses/detailProduct.response';
import { CollectionType } from '@prisma/client';
import { CreateCollectionDto } from '../dtos/createCollection.dto';
import { CreateReviewDto } from '../dtos/createReview.dto';
import { UserData } from '@/utils/decorators/user.decorator';

export interface ProductRepositoryInterface {
  createProduct(
    addProductDto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>>;

  searchProduct(
    dto: SearchProductDto,
  ): Promise<ApiResponseDto<ProductResponse[]>>;

  getDetailProduct(id: number): Promise<ApiResponseDto<DetailProductResponse>>;

  getAllCategories(): Promise<ApiResponseDto<CategoryResponse[]>>;

  createProductCollection(
    dto: CreateCollectionDto,
  ): Promise<ApiResponseDto<boolean>>;

  getProductCollections(
    type: CollectionType,
  ): Promise<ApiResponseDto<ProductResponse[]>>;

  createReview(dto: CreateReviewDto, user: UserData): Promise<ApiResponseDto<boolean>>;
}
