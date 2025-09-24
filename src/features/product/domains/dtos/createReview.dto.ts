import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  product_id: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  rating: number;

  @Transform(({ value }) => value ?? '')
  @IsOptional()
  comment?: string;

  @Transform(({ value }) => value ?? '')
  @IsOptional()
  image_url?: string;
}
