import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';

@Injectable()
export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(
    role: Role,
    dto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>> {
    return this.productRepository.createProduct(role, dto);
  }

  async searchProduct(dto: SearchProductDto) : Promise<ApiResponseDto<ProductResponse[]>> {
    return this.productRepository.searchProduct(dto)
  }
}
