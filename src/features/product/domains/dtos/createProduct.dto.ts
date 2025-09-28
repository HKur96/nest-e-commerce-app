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
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sellerId: number;
  categoryId: number;
  images?: string[];
  variants?: { name: string; value: string }[];
}
