import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddToCart {
  @IsNotEmpty()
  @Type(() => Number) // Converts the string parameter to a number
  @IsInt()
  user_id: number;

  @Transform(({ value }) => value ?? 1)
  @Type(() => Number) // Converts the string parameter to a number
  @IsInt()
  product_id: number;
  quantity = 1;
}
