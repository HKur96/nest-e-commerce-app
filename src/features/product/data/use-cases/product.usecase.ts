import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { CollectionType, Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import { CategoryResponse } from '../../domains/responses/category.response';
import { DetailProductResponse } from '../../domains/responses/detailProduct.response';
import { ProductCollectionResponse } from '../../domains/responses/productCollection.response';
import { CreateCollectionDto } from '../../domains/dtos/createCollection.dto';

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

  async getAllProductCollections(
    type: CollectionType,
  ): Promise<ApiResponseDto<ProductCollectionResponse[]>> {
    return await this.productRepository.getAllProductCollections(type);
  }

  async addProductCollection(
    dto: CreateCollectionDto,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.productRepository.addProductCollection(dto);
  }

  async deleteProductCollection(
    collectionId: number,
    productId: number,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.productRepository.deleteProductCollection(
      collectionId,
      productId,
    );
  }
}
