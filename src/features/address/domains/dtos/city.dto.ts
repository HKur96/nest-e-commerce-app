import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CityDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    province_id: number;
}