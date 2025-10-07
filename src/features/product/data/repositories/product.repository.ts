import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { CollectionType, Prisma, Role } from '@prisma/client';
import { CreateProductDto } from '../../domains/dtos/createProduct.dto';
import { ProductRepositoryInterface } from '../../domains/repositories/ProductRepositoryInterface';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ProductResponse } from '../../domains/responses/product.response';
import { SearchProductDto } from '../../domains/dtos/searchProduct.dto';
import { CategoryResponse } from '../../domains/responses/category.response';
import {
  CollectionDetail,
  DetailProductResponse,
  ReviewDetail,
} from '../../domains/responses/detailProduct.response';
import { CreateCollectionDto } from '../../domains/dtos/createCollection.dto';

@Injectable()
export class ProductRepository implements ProductRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async createProductCollection({
    name,
    type,
    product_ids,
    seller_id,
  }: CreateCollectionDto): Promise<ApiResponseDto<boolean>> {
    try {
      const newCollection = await this.prisma.collection.create({
        data: {
          type,
          name,
          products: {
            create: product_ids.map((productId) => ({
              product: { connect: { id: productId } },
            })),
          },
          sellerId: seller_id,
        },
        include: {
          products: {
            include: { product: true },
          },
        },
      });

      return ApiResponseDto.success(
        'Collection created successfully',
        !newCollection,
      );
    } catch (error) {
      return ApiResponseDto.error('Failed to create collection', error.message);
    }
  }

  async getProductCollections(
    type: CollectionType,
  ): Promise<ApiResponseDto<ProductResponse[]>> {
    try {
      const collection = await this.prisma.collection.findUnique({
        where: { type },
        select: {
          products: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: { select: { url: true } },
                  price: true,
                  totalSold: true,
                  seller: { select: { isOfficial: true, merchantName: true } },
                  reviews: {
                    select: {
                      rating: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const withAvg = collection.products.map((p) => {
        const ratings = p.product.reviews.map((r) => r.rating);
        const avgRating =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : 0;
        return { ...p, avgRating };
      });

      return ApiResponseDto.success(
        'Collections retrieved successfully',
        withAvg.map<ProductResponse>(
          (product) =>
            new ProductResponse({
              id: product.product.id,
              name: product.product.name,
              price: product.product.price.toNumber(),
              total_sold: product.product.totalSold ?? 0,
              images: product.product.images.map((img) => img.url),
              avg_rating: product.avgRating,
              seller_name: product.product.seller.merchantName,
              is_official_store: product.product.seller.isOfficial,
            }),
        ),
      );
    } catch (error) {
      console.error(error);
      return ApiResponseDto.error(
        'Failed to retrieve collections',
        error.message,
      );
    }
  }

  async getDetailProduct(
    id: number,
  ): Promise<ApiResponseDto<DetailProductResponse>> {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          images: { select: { url: true } },
          seller: {
            select: {
              merchantName: true,
              merchantLogoUrl: true,
              address: { select: { city: { select: { name: true } } } },
              isOfficial: true,
            },
          },
          category: { select: { name: true } },
          reviews: {
            select: {
              comment: true,
              rating: true,
              user: { select: { name: true } },
            },
          },
          variants: { select: { name: true } },
          collections: {
            select: { collection: { select: { name: true, type: true } } },
          },
        },
      });

      if (!product) {
        return ApiResponseDto.error('Product not found', 404);
      }

      return ApiResponseDto.success(
        'Detail product successfully got',
        new DetailProductResponse({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          price: product.price.toNumber(),
          slug: product.slug,
          total_sold: product.totalSold,
          stock: product.stock,
          image_urls: product.images.map<string>((img) => img.url),
          seller_name: product.seller?.merchantName ?? '',
          seller_location: product.seller?.address?.city?.name ?? '',
          seller_icon_url: product.seller?.merchantLogoUrl,
          is_official_seller: product.seller?.isOfficial == true,
          category_name: product.category.name,
          reviews: product.reviews.map<ReviewDetail>(
            (review) =>
              new ReviewDetail({
                user_name: review.user.name,
                comment: review.comment,
                rating: review.rating,
              }),
          ),
          variants: product.variants.map<string>((vr) => vr.name),
          collections: product.collections.map<CollectionDetail>(
            (cl) =>
              new CollectionDetail({
                name: cl.collection.name,
                type: cl.collection.type,
              }),
          ),
        }),
      );
    } catch (error) {
      return ApiResponseDto.error('Unexpected error while get detail product');
    }
  }

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
          select: { isOfficial: true, merchant_name: true },
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
                seller_name: product.seller.merchant_name,
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
              seller_name: product.seller.merchant_name,
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
