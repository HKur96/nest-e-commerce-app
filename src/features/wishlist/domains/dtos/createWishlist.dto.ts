import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateWishlistDto {
  @IsNotEmpty()
  @Type(() => Number) // Converts the string parameter to a number
  @IsInt()
  user_id: number;

  @IsNotEmpty()
  @Type(() => Number) // Converts the string parameter to a number
  @IsInt()
  product_id: number;
}
