import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/config/prisma/prisma.service';
import { UserRepositoryInterface } from '../../domains/repositories/UserRepositoryInterface';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponseDto } from '@/utils/response/api.response.dto';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../../domains/dtos/signIn.dto';
import { UpdateUserDto } from '../../domains/dtos/updateUser.dto';
import { UserData } from '@/utils/decorators/user.decorator';
import { UpsertAddressDto } from '../../domains/dtos/upsertAddress.dto';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  /**
   * Upsert a list of addresses for a user.
   * - If `id` is provided, update that address.
   * - If `id` is missing, create a new address.
   */
  async upsertUserAddress(
    dtos: UpsertAddressDto[],
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    try {
      if (!dtos || !dtos.length) {
        return ApiResponseDto.error(
          'The request body should not be empty',
          401,
        );
      }

      const filteredData = dtos.filter((item) => {
        return (
          item != null &&
          !(typeof item === 'object' && Object.keys(item).length === 0)
        );
      });

      if (!filteredData.length) {
        return ApiResponseDto.error(
          'The request body should not be empty',
          401,
        );
      }

      await this.prisma.$transaction(
        filteredData.map((addr) =>
          this.prisma.address.upsert({
            where: { id: addr.id ?? 0 }, // 0 will never match → triggers create
            update: {
              provinceId: addr.province_id,
              cityId: addr.city_id,
              subdistrictId: addr.subdistrict_id,
              wardId: addr.ward_id,
              streetName: addr.street_name,
              detail: addr.detail,
              updatedAt: new Date(),
            },
            create: {
              userId: user.id,
              provinceId: addr.province_id,
              cityId: addr.city_id,
              subdistrictId: addr.subdistrict_id,
              wardId: addr.ward_id,
              streetName: addr.street_name,
              detail: addr.detail,
            },
          }),
        ),
      );

      return ApiResponseDto.success('Address successfully updated', true);
    } catch (err) {
      return ApiResponseDto.error('Unexpected error');
    }
  }

  async updateUserCart(): Promise<ApiResponseDto<UserResponse>> {
    throw new Error('Method not implemented.');
  }

  async updateUserSeller(): Promise<ApiResponseDto<UserResponse>> {
    throw new Error('Method not implemented.');
  }

  async updateUserCore(
    { name, email, password, avatar_url }: UpdateUserDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });
    if (!existingUser) {
      return ApiResponseDto.error('User not found', 404);
    }

    const data: any = { name, email, avatar_url };

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(password, salt);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data,
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          updatedAt: true,
        },
      });

      return ApiResponseDto.success(
        'User successfully updated',
        new UserResponse({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          avatar_url: updatedUser.avatarUrl,
          role: user.role,
        }),
      );
    } catch (err) {
      throw ApiResponseDto.error('Unexpected error');
    }
  }

  async signIn(dto: SignInDto): Promise<ApiResponseDto<UserResponse>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (!user) {
        return ApiResponseDto.error(`User with ${dto.email} is not found`);
      }

      if (user.role !== dto.role) {
        return ApiResponseDto.error('Unauthorized', 401);
      }

      // Check password
      const isValid = await bcrypt.compare(dto.password, user.password);

      if (!isValid) {
        return ApiResponseDto.error('Invalid password', 403);
      }

      // Generate JWT token
      const token = await this.jwtService.signAsync({
        id: user.id,
        email: user.email,
        role: dto.role,
      });

      return ApiResponseDto.success(
        'User registered succesfully',
        new UserResponse({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_url: user.avatarUrl,
          role: user.role,
          token,
        }),
      );
    } catch (error) {
      return ApiResponseDto.error('Unexpected error');
    }
  }

  async signUp(dto: SignUpDto): Promise<ApiResponseDto<UserResponse>> {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (existingUser) {
        return ApiResponseDto.error('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const newUser = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: dto.role,
          avatarUrl: dto.avatar_url,
        },
      });

      // Generate JWT token
      const token = await this.jwtService.signAsync({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      });

      return ApiResponseDto.success(
        'User registered succesfully',
        new UserResponse({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          avatar_url: newUser.avatarUrl,
          role: newUser.role,
          token,
        }),
      );
    } catch (err) {
      return ApiResponseDto.error('Unexpected error');
    }
  }
}
