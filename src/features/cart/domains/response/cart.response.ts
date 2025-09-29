import { ApiProperty } from '@nestjs/swagger';

export class CartResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  product_id: number;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  product_images: string[];

  @ApiProperty()
  product_quantity: number;

  @ApiProperty()
  product_price: number;

  constructor(partial: Partial<CartResponse>) {
    Object.assign(this, partial);
  }
}
