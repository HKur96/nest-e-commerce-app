import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class SearchProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(['price', 'rating'])
  sortBy?: 'price' | 'rating';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsNumberString()
  page?: string; // Can be parsed into number later

  @IsOptional()
  @IsNumberString()
  pageSize?: string; // Same
}
