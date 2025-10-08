import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty({ enum: CollectionType })
  @IsNotEmpty()
  @IsEnum(CollectionType)
  type: CollectionType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  seller_id: number;

  @ApiProperty({ type: [Number], required: true })
  @IsArray()
  @Type(() => Number)
  @ArrayMinSize(1)
  product_ids: number[];
}
