import { ApiProperty } from "@nestjs/swagger";

export class ProductResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total_sold: number;

  @ApiProperty()
  seller_name: string;

  @ApiProperty()
  images: string[] | null;

  @ApiProperty()
  avg_rating: number;

  @ApiProperty()
  is_official_store: boolean;

  constructor(partial: Partial<ProductResponse>) {
    Object.assign(this, partial);
  }
}
