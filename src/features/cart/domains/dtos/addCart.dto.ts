import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class AddToCart {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number) // Converts the string parameter to a number
  @IsInt()
  user_id: number;

  @ApiProperty()
  @Transform(({ value }) => value ?? 1)
  @Type(() => Number) // Converts the string parameter to a number
  @IsInt()
  product_id: number;

  @ApiProperty({example: 1})
  quantity = 1;
}
