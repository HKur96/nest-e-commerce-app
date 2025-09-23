import { ApiResponse } from '@/utils/response/api.response';
import { Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ProductRepositoryInterface } from '../../domains/repositories/ProductRepositoryInterface';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}
  async searchProduct({
    name,
    sortBy,
    sortOrder,
    page,
    pageSize,
  }: SearchProductDto): Promise<ApiResponse<ProductResponse[]>> {
    try {
      const safePage = Math.max(1, Number(page) || 1);
      const safePageSize = Math.max(1, Number(pageSize) || 10);
      const skip = (safePage - 1) * safePageSize;

      const products = await this.prisma.product.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          reviews: true,
          discount: true,
          images: {
            where: {
              isThumbnail: true,
            },
            orderBy: {
              position: 'asc',
            },
            take: 1,
          },
        },
        skip,
        take: safePageSize,
      });

      const totalCount = await this.prisma.product.count({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });

      const enriched = products.map((product) => {
        const averageRating =
          product.reviews.length > 0
            ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
              product.reviews.length
            : 0;

        return {
          ...product,
          averageRating,
        };
      });

      const sorted = enriched.sort((a, b) => {
        if (sortBy === 'price') {
          return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        } else {
          return sortOrder === 'asc'
            ? a.averageRating - b.averageRating
            : b.averageRating - a.averageRating;
        }
      });

      return ApiResponse.success(
        'Success search product',
        sorted.map((sort) => {
          return new ProductResponse(sort);
        }),
        200,
        safePage,
        Math.ceil(totalCount / safePageSize),
      );
    } catch (error) {
      return ApiResponse.error('Unexpected error');
    }
  }

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
      return ApiResponse.error('Unexpected error');
    }
  }
}
