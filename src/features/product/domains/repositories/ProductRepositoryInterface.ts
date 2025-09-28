import { Role } from '@prisma/client';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../responses/product.response';
import { SearchProductDto } from '../dtos/searchProduct.dto';

export interface ProductRepositoryInterface {
  createProduct(
    role: Role,
    addProductDto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>>;

  searchProduct(dto: SearchProductDto): Promise<ApiResponseDto<ProductResponse[]>>;
}
