import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty()
  productId: number;

  @ApiProperty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty()
  delivery_id: number;

  @ApiProperty()
  products: ProductDto[];
}
