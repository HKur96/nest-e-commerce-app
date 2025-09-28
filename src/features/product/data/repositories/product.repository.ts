import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { Prisma, Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ProductRepositoryInterface } from '../../domains/repositories/ProductRepositoryInterface';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import { CategoryResponse } from '../../domains/responses/category.response';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async getAllCategories(): Promise<ApiResponseDto<CategoryResponse[]>> {
    try {
      const categories = await this.prisma.category.findMany();

      return ApiResponseDto.success<CategoryResponse[]>(
        'Category successfully got',
        categories.map<CategoryResponse>((category) => {
          return new CategoryResponse({
            id: category.id,
            name: category.name,
            slug: category.slug,
            icon_url: category.iconUrl,
          });
        }),
      );
    } catch (error) {
      console.log(error);
      return ApiResponseDto.error('Unexpected error');
    }
  }

  /**
   * Search products with pagination and sort by price or average review rating
   *
   * @param page        Page number (default 1)
   * @param pageSize    Items per page (default 10)
   * @param search      Optional product name search
   * @param sortBy      'price' | 'review'
   * @param sortOrder   'asc' | 'desc'
   */
  async searchProduct({
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
  }: SearchProductDto): Promise<ApiResponseDto<ProductResponse[]>> {
    try {
      const skip = (page - 1) * pageSize;

      // --- Base where condition ---
      const where: Prisma.ProductWhereInput = search
        ? { name: { contains: search, mode: Prisma.QueryMode.insensitive } }
        : {};

      // --- Common select to avoid overfetching ---
      const productSelect = {
        id: true,
        name: true,
        price: true,
        totalSold: true,
        images: { select: { url: true } },
        reviews: { select: { rating: true } },
        seller: {
          select: { isOfficial: true, user: { select: { name: true } } },
        },
      };

      // --- Sorting by average review rating (needs JS aggregation) ---
      if (sortBy === 'review') {
        const products = await this.prisma.product.findMany({
          where,
          skip,
          take: pageSize,
          select: productSelect,
        });

        // Compute avg rating and sort in JS
        const withAvg = products.map((p) => {
          const ratings = p.reviews.map((r) => r.rating);
          const avgRating =
            ratings.length > 0
              ? ratings.reduce((a, b) => a + b, 0) / ratings.length
              : 0;
          return { ...p, avgRating };
        });

        withAvg.sort((a, b) =>
          sortOrder === 'asc'
            ? a.avgRating - b.avgRating
            : b.avgRating - a.avgRating,
        );

        const total = await this.prisma.product.count({ where });
        return ApiResponseDto.success(
          'Product successfully fetched',
          withAvg.map<ProductResponse>(
            (product) =>
              new ProductResponse({
                id: product.id,
                name: product.name,
                price: product.price.toNumber(),
                total_sold: product.totalSold ?? 0,
                images: product.images.map((img) => img.url),
                avg_rating: product.avgRating,
                seller_name: product.seller.user.name,
                is_official_store: product.seller.isOfficial,
              }),
          ),
          200,
          page,
          Math.ceil(total / pageSize),
        );
      }

      // --- Sorting by price (handled by DB for performance) ---
      const products = await this.prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { price: sortOrder },
        select: productSelect,
      });

      const withAvg = products.map((p) => {
        const ratings = p.reviews.map((r) => r.rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
        return { ...p, avgRating };
      });

      const total = await this.prisma.product.count({ where });

      return ApiResponseDto.success(
        'Product successfully fetched',
        withAvg.map<ProductResponse>(
          (product) =>
            new ProductResponse({
              id: product.id,
              name: product.name,
              price: product.price.toNumber(),
              total_sold: product.totalSold ?? 0,
              images: product.images.map((img) => img.url),
              avg_rating: product.avgRating,
              seller_name: product.seller.user.name,
              is_official_store: product.seller.isOfficial,
            }),
        ),
        200,
        page,
        Math.ceil(total / pageSize),
      );
    } catch (error) {
      console.error('searchProduct error:', error);
      return ApiResponseDto.error('Unexpected error occurred');
    }
  }

  async createProduct({
    price,
    images,
    variants,
    ...productData
  }: CreateProductDto): Promise<ApiResponseDto<ProductResponse>> {
    try {
      const productSelect = {
        id: true,
        name: true,
        price: true,
        totalSold: true,
        images: { select: { url: true } },
        reviews: { select: { rating: true } },
        seller: {
          select: { isOfficial: true, user: { select: { name: true } } },
        },
      };

      const product = await this.prisma.product.create({
        data: {
          ...productData,
          price: new Prisma.Decimal(price),
          ...(images?.length && {
            images: { create: images.map((url) => ({ url })) },
          }),
          ...(variants?.length && {
            variants: {
              create: variants.map((v) => ({ name: v.name, value: v.value })),
            },
          }),
        },
        select: productSelect,
      });

      const ratings = product.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      return ApiResponseDto.success(
        'Product successfully created',
        new ProductResponse({
          id: product.id,
          name: product.name,
          price: product.price.toNumber(),
          total_sold: product.totalSold ?? 0,
          images: product.images.map((img) => img.url),
          avg_rating: avgRating,
          seller_name: product.seller.user.name,
          is_official_store: product.seller.isOfficial,
        }),
      );
    } catch (err) {
      console.error('createProduct error:', err);
      return ApiResponseDto.error('Unexpected error while creating product');
    }
  }
}
