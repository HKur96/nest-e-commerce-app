import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponse } from '@/utils/response/api.response';
import { ProductResponse } from '../../domains/responses/product.response';

@Injectable()
export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(
    role: Role,
    dto: CreateProductDto,
  ): Promise<ApiResponse<ProductResponse>> {
    return this.productRepository.createProduct(role, dto);
  }
}
