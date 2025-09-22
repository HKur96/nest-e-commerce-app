import { Role } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsEnum(Role, { message: 'role must be either ADMIN, BUYER, or SELLER' })
  role: Role;

  @IsNotEmpty()
  @IsString()
  street: string;


  city: string;

  state: string;

  zipCode: string;
  
  country: string;
}
