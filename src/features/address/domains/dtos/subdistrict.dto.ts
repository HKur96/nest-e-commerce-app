import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SubDistrictDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    city_id: number;
}