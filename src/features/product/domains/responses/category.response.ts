import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty({example: 1})
  id: number;

  @ApiProperty({example: 'test'})
  name: string;

  @ApiProperty({example: 'test'})
  icon_url?: string;

  @ApiProperty({example: 'test'})
  slug: string;

  constructor(partial: Partial<CategoryResponse>) {
    Object.assign(this, partial);
  }
}
