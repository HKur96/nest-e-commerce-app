import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSellerDto {
  @ApiProperty({
    example: 'Fill with id if update address, set null if new address',
  })
  @IsOptional()
  @IsNumber()
  address_id?: number;

  @ApiProperty()
  province_id: number;

  @ApiProperty()
  city_id: number;

  @ApiProperty()
  subdistrict_id: number;

  @ApiProperty()
  ward_id: number;

  @ApiProperty()
  street_name: string;

  @ApiProperty()
  address_detail: string;

  @ApiProperty()
  merchant_name: string;

  @ApiProperty()
  merchant_logo_url: string;
}
