import { ApiProperty } from '@nestjs/swagger';

export class AddressDetailResponse {
  @ApiProperty()
  province_id: number;

  @ApiProperty()
  province_name: string;

  @ApiProperty()
  city_id: number;

  @ApiProperty()
  city_name: string;

  @ApiProperty()
  subdistrict_id: number;

  @ApiProperty()
  subdistrict_name: string;

  @ApiProperty()
  ward_id: number;

  @ApiProperty()
  ward_name: string;

  @ApiProperty()
  street_name: string;

  @ApiProperty()
  detail_address: string;

  constructor(partial: Partial<AddressDetailResponse>) {
    Object.assign(this, partial);
  }
}

export class UserDetailResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar_url?: string;

  @ApiProperty()
  role: string;

  @ApiProperty({type: () => [AddressDetailResponse]})
  addresses: AddressDetailResponse[];

  @ApiProperty()
  is_seller: boolean;

  constructor(partial: Partial<UserDetailResponse>) {
    Object.assign(this, partial);
  }
}
