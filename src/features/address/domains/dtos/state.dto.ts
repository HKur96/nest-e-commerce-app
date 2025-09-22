import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class StateDto {
    @IsNotEmpty()
    @IsString()
    name: string; 

    @IsNotEmpty()
    @IsString()
    @MaxLength(2)
    code: string;
}