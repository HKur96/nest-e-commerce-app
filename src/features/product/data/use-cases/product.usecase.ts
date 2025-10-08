import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CollectionType, Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import { CategoryResponse } from '../../domains/responses/category.response';
import { DetailProductResponse } from '../../domains/responses/detailProduct.response';
import { CreateCollectionDto } from '../../domains/dtos/createCollection.dto';
import { CreateReviewDto } from '../../domains/dtos/createReview.dto';
import { UserData } from '@/utils/decorators/user.decorator';

@Injectable()
export class ProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(
    dto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>> {
    return this.productRepository.createProduct(dto);
  }

  async searchProduct(
    dto: SearchProductDto,
  ): Promise<ApiResponseDto<ProductResponse[]>> {
    return this.productRepository.searchProduct(dto);
  }

  async getAllCategories(): Promise<ApiResponseDto<CategoryResponse[]>> {
    return await this.productRepository.getAllCategories();
  }

  async getDetailProduct(
    id: number,
  ): Promise<ApiResponseDto<DetailProductResponse>> {
    return await this.productRepository.getDetailProduct(id);
  }

  async createProductCollection(
    dto: CreateCollectionDto,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.productRepository.createProductCollection(dto);
  }

  async getProductCollections(
    type: CollectionType,
  ): Promise<ApiResponseDto<ProductResponse[]>> {
    return await this.productRepository.getProductCollections(type);
  }

  async createReview(
    dto: CreateReviewDto,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.productRepository.createReview(dto, user);
  }
}
