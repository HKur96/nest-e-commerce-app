import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sellerId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  stockQuantity: number;

  @IsNumber()
  @IsOptional()
  discountId?: number;

  @IsArray()
  images: Image[];
}

export class Image {
  url: string;
  altText?: string;
  position: number;
  isThumbnail?: boolean;
}
