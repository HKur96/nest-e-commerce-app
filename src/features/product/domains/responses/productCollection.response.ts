import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from '@prisma/client';
import { ProductResponse } from './product.response';

export class ProductCollectionResponse {
  @ApiProperty()
  collection_id: number;

  @ApiProperty({
    enum: CollectionType,
    enumName: 'Collection Type',
  })
  collection_type: CollectionType;

  @ApiProperty({ type: () => [ProductResponse] })
  products: ProductResponse[];

  constructor(partial: Partial<ProductCollectionResponse>) {
    Object.assign(this, partial);
  }
}
