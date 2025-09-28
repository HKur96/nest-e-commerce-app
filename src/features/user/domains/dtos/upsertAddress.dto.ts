import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertAddressDto {
  @ApiProperty({ example: null })
  @IsOptional()
  @IsInt()
  id?: number; // If provided, we update; if not, we insert

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  province_id: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  city_id: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  subdistrict_id: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @IsNotEmpty()
  ward_id: number;

  @ApiProperty({ example: '' })
  @IsString()
  @IsNotEmpty()
  street_name: string;

  @ApiProperty({ example: 'Jl jalan' })
  @IsString()
  @IsOptional()
  detail?: string;
}
