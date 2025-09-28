import { CreateProductDto } from '../dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../responses/product.response';
import { SearchProductDto } from '../dtos/searchProduct.dto';
import { CategoryResponse } from '../responses/category.response';

export interface ProductRepositoryInterface {
  createProduct(
    addProductDto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>>;

  searchProduct(
    dto: SearchProductDto,
  ): Promise<ApiResponseDto<ProductResponse[]>>;

  getAllCategories(): Promise<ApiResponseDto<CategoryResponse[]>>;
}
