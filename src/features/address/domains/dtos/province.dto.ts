import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class ProvinceDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
}