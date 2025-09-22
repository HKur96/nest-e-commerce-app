import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ProvinceDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    state_id: number;
}