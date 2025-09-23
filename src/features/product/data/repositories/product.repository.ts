import { ApiResponse } from '@/utils/response/api.response';
import { Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ProductRepositoryInterface } from '../../domains/repositories/ProductRepositoryInterface';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProductResponse } from '../../domains/responses/product.response';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(
    role: Role,
    {
      sellerId,
      name,
      description,
      price,
      categoryId,
      discountId,
      stockQuantity,
      images,
    }: CreateProductDto,
  ): Promise<ApiResponse<ProductResponse>> {
    try {
      const product = await this.prisma.product.create({
        data: {
          sellerId,
          name,
          description,
          price,
          categoryId,
          discountId,
          stock: {
            create: {
              quantity: stockQuantity,
            },
          },
          images: images?.length
            ? {
                create: images,
              }
            : undefined,
        },
        include: {
          stock: true,
          images: true,
        },
      });

      return ApiResponse.success(
        'Create product succesfully',
        new ProductResponse(product),
      );
    } catch (error) {
      console.log(error);
      return ApiResponse.error('Unexpected error');
    }
  }
}
