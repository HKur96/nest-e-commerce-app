import { ApiProperty } from '@nestjs/swagger';
import { CollectionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateCollectionDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CollectionType)
  type: CollectionType;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  seller_id: number;

  @ApiProperty({ type: () => [Number], required: true })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Number)
  product_ids: number[];
}
