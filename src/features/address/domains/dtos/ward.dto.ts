import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WardDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  subdistrict_id: number;
}
