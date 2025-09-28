import { ApiProperty } from '@nestjs/swagger';

export class UserAddress {
  @ApiProperty()
  id: number;

  @ApiProperty()
  province_name: string;

  @ApiProperty()
  city_name: string;

  @ApiProperty()
  subdistrict_name: string;

  @ApiProperty()
  ward_name: string;

  @ApiProperty()
  street_name: string;

  constructor(partial: Partial<UserAddress>) {
    Object.assign(this, partial);
  }
}
