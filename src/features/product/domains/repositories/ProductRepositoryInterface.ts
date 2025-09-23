import { Role } from '@prisma/client';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { ApiResponse } from '@/utils/response/api.response';
import { ProductResponse } from '../responses/product.response';

export interface ProductRepositoryInterface {
  createProduct(
    role: Role,
    addProductDto: CreateProductDto,
  ): Promise<ApiResponse<ProductResponse>>;
}
