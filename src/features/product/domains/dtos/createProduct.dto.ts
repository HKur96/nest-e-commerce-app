import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
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
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class Image {
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  altText?: string;

  @IsNotEmpty()
  @IsNumber()
  position: number;

  @IsOptional()
  isThumbnail?: boolean = true;
}
