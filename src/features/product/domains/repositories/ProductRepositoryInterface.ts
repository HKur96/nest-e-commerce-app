import { Role } from '@prisma/client';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { ApiResponse } from '@/utils/response/api.response';
import { ProductResponse } from '../responses/product.response';
import { SearchProductDto } from '../dtos/searchProduct.dto';

export interface ProductRepositoryInterface {
  createProduct(
    role: Role,
    addProductDto: CreateProductDto,
  ): Promise<ApiResponse<ProductResponse>>;

  searchProduct(dto: SearchProductDto): Promise<ApiResponse<ProductResponse[]>>;
}
