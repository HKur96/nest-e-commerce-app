import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { UserRepositoryInterface } from '../../domains/repositories/UserRepositoryInterface';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponse } from '@/utils/response/api.response';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  @Roles(Role.BUYER)
  async signUpBuyer(dto: SignUpDto): Promise<ApiResponse<UserResponse>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        return ApiResponse.error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: dto.role,
        },
      });

      // Generate JWT token
      const token = await this.jwtService.signAsync({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      return ApiResponse.success(
        'User registered succesfully',
        new UserResponse({
          name: newUser.name,
          email: newUser.email,
          token,
        }),
      );
    } catch (err) {
      console.log(err);
      return ApiResponse.error('Unexpected error');
    }
  }
}
