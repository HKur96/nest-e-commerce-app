import { CreateProductDto } from '../dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../responses/product.response';
import { SearchProductDto } from '../dtos/searchProduct.dto';
import { CategoryResponse } from '../responses/category.response';
import { DetailProductResponse } from '../responses/detailProduct.response';

export interface ProductRepositoryInterface {
  createProduct(
    addProductDto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>>;

  searchProduct(
    dto: SearchProductDto,
  ): Promise<ApiResponseDto<ProductResponse[]>>;

  getDetailProduct(id: number): Promise<ApiResponseDto<DetailProductResponse>>;

  getAllCategories(): Promise<ApiResponseDto<CategoryResponse[]>>;
}
