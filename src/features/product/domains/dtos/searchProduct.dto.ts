import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchProductDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  page = 1;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  pageSize = 10;

  @ApiProperty()
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['price', 'review'])
  sortBy: 'price' | 'review' = 'price';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'asc';
}
