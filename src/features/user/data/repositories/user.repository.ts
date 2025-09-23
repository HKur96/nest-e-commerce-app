import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { UserRepositoryInterface } from '../../domains/repositories/UserRepositoryInterface';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponse } from '@/utils/response/api.response';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../../domains/dtos/signIn.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signIn(
    role: Role,
    dto: SignInDto,
  ): Promise<ApiResponse<UserResponse>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user)
        return ApiResponse.error(`User with ${dto.email} is not found`);

      // Check password
      const isValid = await bcrypt.compare(dto.password, user.password);

      if (!isValid) {
        return ApiResponse.error('Invalid password', 403);
      }

      // Generate JWT token
      const token = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        role,
      });

      return ApiResponse.success(
        'User registered succesfully',
        new UserResponse({
          name: user.name,
          email: user.email,
          token,
          id: user.id,
        }),
      );
    } catch (error) {
      return ApiResponse.error('Unexpected error');
    }
  }

  async signUp(
    role: Role,
    dto: SignUpDto,
  ): Promise<ApiResponse<UserResponse>> {
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
          role: role,
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
          id: newUser.id,
        }),
      );
    } catch (err) {
      return ApiResponse.error('Unexpected error');
    }
  }
}
