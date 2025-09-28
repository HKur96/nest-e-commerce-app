import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { Prisma, Role } from '@prisma/client';
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
    keyword,
    sortOrder,
    page,
    pageSize,
    categoryId,
  }: SearchProductDto): Promise<ApiResponseDto<ProductResponse[]>> {
    try {
      const safePage = Math.max(1, Number(page) || 1);
      const safePageSize = Math.max(1, Number(pageSize) || 10);
      const skip = (safePage - 1) * safePageSize;

      const where: Prisma.ProductWhereInput = {};
      if (keyword) {
        where.name = { contains: keyword, mode: 'insensitive' };
      }
      if (categoryId) {
        where.categoryId = categoryId;
      }

      const [products, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          where,
          skip,
          take: safePageSize,
          orderBy: { price: sortOrder === 'desc' ? 'desc' : 'asc' },
          include: {
            images: true,
            seller: { select: { id: true, user: { select: { name: true } } } },
            category: { select: { id: true, name: true } },
          },
        }),
        this.prisma.product.count({ where }),
      ]);

      return ApiResponseDto.success(
        'Product successfully got',
        products.map<ProductResponse>((product) => {
          return new ProductResponse(product);
        }),
        200,
        safePage,
        Math.ceil(total / safePageSize),
      );
    } catch (error) {
      console.error('searchProduct error:', error);
      return ApiResponseDto.error('Unexpected error');
    }
  }

  async createProduct(
    role: Role,
    { price, images, variants, ...productData }: CreateProductDto,
  ): Promise<ApiResponseDto<ProductResponse>> {
    try {
      const product = await this.prisma.product.create({
        data: {
          ...productData,
          price: new Prisma.Decimal(price),
          images: images
            ? { create: images.map((url) => ({ url })) }
            : undefined,
          variants: variants
            ? {
                create: variants.map((v) => ({ name: v.name, value: v.value })),
              }
            : undefined,
        },
        include: {
          images: true,
          variants: true,
        },
      });

      return ApiResponseDto.success(
        'Product successfully created',
        new ProductResponse(product),
      );
    } catch (err) {
      return ApiResponseDto.error('Unexpected error');
    }
  }
}
