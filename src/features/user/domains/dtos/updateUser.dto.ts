import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({example: null})
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({example: null})
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({example: null})
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({example: null})
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({example: null})
  @IsOptional()
  @IsString()
  phone_number?: string;
}
