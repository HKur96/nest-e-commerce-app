import { ApiProperty } from '@nestjs/swagger';

export class WishlistResponse {
  @ApiProperty()
  user_id: number;

  @ApiProperty()
  product_id: number;

  @ApiProperty()
  product_name: string;

  @ApiProperty()
  product_price: number;

  @ApiProperty()
  product_images: string[];

  constructor(partial: Partial<WishlistResponse>) {
    Object.assign(this, partial);
  }
}
