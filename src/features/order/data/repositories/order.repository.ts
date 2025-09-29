import { UserData } from '@/utils/decorators/user.decorator';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { CreateOrderDto } from '../../domains/dtos/createOrder.dto';
import { OrderRepositoryInterface } from '../../domains/repositories/OrderRepositoryInterface';
import {
  OrderResponse,
  ProductOrderResponse,
} from '../../domains/response/order.response';
import { OrderDetailResponse } from '../../domains/response/orderDetail.response';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { UpdateOrderDto } from '../../domains/dtos/updateOrder.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class OrderRepository implements OrderRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async updateOrderById(
    orderId: number,
    dto: UpdateOrderDto,
  ): Promise<ApiResponseDto<boolean>> {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        return ApiResponseDto.error('Order not found', 404);
      }

      await this.prisma.order.update({
        where: { id: orderId },
        data: {
          ...(dto.status && { status: dto.status }),
          ...(dto.delivery_id && { deliveryId: dto.delivery_id }),
        },
      });

      return ApiResponseDto.success('Order successfully updated', true);
    } catch (error) {
      return ApiResponseDto.error(
        'Unexpected error while updating order by id',
      );
    }
  }

  async createOrder(
    { delivery_id, products }: CreateOrderDto,
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    try {
      if (products.length === 0) {
        return ApiResponseDto.error('No products provided', 400);
      }

      // ✅ Validate delivery service
      const delivery = await this.prisma.deliveryService.findUnique({
        where: { id: delivery_id },
      });
      if (!delivery) {
        return ApiResponseDto.error(
          `Delivery service ${delivery_id} not found`,
          404,
        );
      }

      // ✅ Fetch product prices & stocks
      const dbProducts = await this.prisma.product.findMany({
        where: { id: { in: products.map((p) => p.productId) } },
        select: { id: true, price: true, stock: true },
      });

      const orderProducts: Prisma.OrderProductCreateManyOrderInput[] = [];
      let totalPrice = new Prisma.Decimal(0);

      for (const p of products) {
        const prod = dbProducts.find((d) => d.id === p.productId);
        if (!prod) {
          return ApiResponseDto.error(`Product ${p.productId} not found`, 404);
        }
        if (prod.stock < p.quantity) {
          return ApiResponseDto.error(
            `Product ${p.productId} out of stock`,
            400,
          );
        }

        const subtotal = prod.price.mul(p.quantity);
        totalPrice = totalPrice.add(subtotal);
        orderProducts.push({
          productId: p.productId,
          quantity: p.quantity,
          price: prod.price,
        });
      }

      // ✅ Transaction for consistency
      await this.prisma.$transaction(async (tx) => {
        await tx.order.create({
          data: {
            userId: user.id,
            deliveryId: delivery_id,
            totalPrice,
            orderProducts: { createMany: { data: orderProducts } },
          },
        });

        // Example stock deduction if required
        // for (const p of products) {
        //   await tx.product.update({
        //     where: { id: p.productId },
        //     data: { stock: { decrement: p.quantity } },
        //   });
        // }
      });

      return ApiResponseDto.success('Order successfully created', true);
    } catch (error) {
      return ApiResponseDto.error('Unexpected error while creating order');
    }
  }

  async getAllOrders(user: UserData): Promise<ApiResponseDto<OrderResponse[]>> {
    try {
      const orders = await this.prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          delivery: {
            select: { id: true, name: true, icon: true, kind: true },
          },
          orderProducts: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  images: { select: { url: true } },
                },
              },
            },
          },
        },
      });

      return ApiResponseDto.success(
        'Orders fetched successfully',
        orders.map<OrderResponse>((order) => {
          return new OrderResponse({
            order_id: order.id,
            total_price: order.totalPrice.toNumber(),
            status: order.status,
            created_at: order.createdAt.toISOString(),
            delivery_id: order.delivery.id,
            delivery_name: order.delivery.name,
            delivery_icon: order.delivery.icon ?? null,
            delivery_kind: order.delivery.kind,
            products: order.orderProducts.map<ProductOrderResponse>((op) => {
              return new ProductOrderResponse({
                product_id: op.product.id,
                product_name: op.product.name,
                product_price: op.product.price.toNumber(),
                product_images: op.product.images.map<string>((img) => img.url),
              });
            }),
          });
        }),
      );
    } catch (error) {
      return ApiResponseDto.error('Unexpected error while getting all orders');
    }
  }

  // TODO: SHOULD BE GET DELIVERY STATUS
  async getOrderDetail(
    id: number,
    user: UserData,
  ): Promise<ApiResponseDto<OrderDetailResponse>> {
    throw new Error('Method not implemented.');
  }
}
