import { ApiProperty } from '@nestjs/swagger';
import { DeliveryKind } from '@prisma/client';

export class OrderProductResponse {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  product_name: string;

  @ApiProperty({ type: [String] })
  product_images: string[];

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  product_price: number;

  constructor(partial: Partial<OrderProductResponse>) {
    Object.assign(this, partial);
  }
}

export class OrderDetailResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  delivery_id: number;

  @ApiProperty()
  delivery_name: string;

  @ApiProperty({ required: false , example: 'string | null'})
  delivery_icon?: string;

  @ApiProperty({ enum: DeliveryKind, example: 'REGULAR | EXPRESS | SAMEDAY' })
  delivery_kind: DeliveryKind;

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty({ type: () => [OrderProductResponse] })
  order_products: OrderProductResponse[];

  constructor(partial: Partial<OrderDetailResponse>) {
    Object.assign(this, partial);
  }
}
