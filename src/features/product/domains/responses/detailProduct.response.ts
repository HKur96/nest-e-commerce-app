import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from '@prisma/client';

export class ReviewDetail {
  @ApiProperty()
  rating: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  user_name: string;

  constructor(partial: Partial<ReviewDetail>) {
    Object.assign(this, partial);
  }
}

export class CollectionDetail {
  @ApiProperty()
  name: string;

  @ApiProperty()
  type: CollectionType

  constructor(partial: Partial<CollectionDetail>) {
    Object.assign(this, partial);
  }
}

export class DetailProductResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  total_sold: number;

  @ApiProperty()
  seller_name: string;

  @ApiProperty()
  seller_location: string;

  @ApiProperty()
  is_official_seller: boolean;

  @ApiProperty()
  seller_icon_url: string;

  @ApiProperty()
  category_name: string;

  @ApiProperty()
  image_urls: string[];

  @ApiProperty()
  variants: string[];

  @ApiProperty()
  reviews: ReviewDetail[];

  @ApiProperty()
  collections: CollectionDetail[];

  constructor(partial: Partial<DetailProductResponse>) {
    Object.assign(this, partial);
  }
}
