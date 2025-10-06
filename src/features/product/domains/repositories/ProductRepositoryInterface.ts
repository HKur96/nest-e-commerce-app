import { CreateProductDto } from '../dtos/createProduct.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ProductResponse } from '../responses/product.response';
import { SearchProductDto } from '../dtos/searchProduct.dto';
import { CategoryResponse } from '../responses/category.response';
import { DetailProductResponse } from '../responses/detailProduct.response';
import { CollectionType } from '@prisma/client';
import { ProductCollectionResponse } from '../responses/productCollection.response';
import { CreateCollectionDto } from '../dtos/createCollection.dto';

export interface ProductRepositoryInterface {
  createProduct(
    addProductDto: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>>;

  searchProduct(
    dto: SearchProductDto,
  ): Promise<ApiResponseDto<ProductResponse[]>>;

  getDetailProduct(id: number): Promise<ApiResponseDto<DetailProductResponse>>;

  getAllCategories(): Promise<ApiResponseDto<CategoryResponse[]>>;

  getAllProductCollections(
    type: CollectionType,
  ): Promise<ApiResponseDto<ProductCollectionResponse[]>>;

  addProductCollection(dto: CreateCollectionDto): Promise<ApiResponseDto<boolean>>;

  deleteProductCollection(collectionId: number, productId: number): Promise<ApiResponseDto<boolean>>;
}
