import { ApiProperty } from '@nestjs/swagger';
import { DeliveryKind } from '@prisma/client';

export class ProductOrderResponse {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  product_images: string[];

  @ApiProperty()
  product_price: number;

  constructor(partial: Partial<ProductOrderResponse>) {
    Object.assign(this, partial);
  }
}

export class OrderResponse {
  @ApiProperty()
  order_id: number;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  delivery_id: number;

  @ApiProperty()
  delivery_kind: DeliveryKind;

  @ApiProperty()
  delivery_name: string;

  @ApiProperty()
  delivery_icon?: string;

  @ApiProperty()
  products: ProductOrderResponse[];

  constructor(partial: Partial<OrderResponse>) {
    Object.assign(this, partial);
  }
}
