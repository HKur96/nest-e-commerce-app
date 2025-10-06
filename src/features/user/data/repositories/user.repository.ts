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
import {
  AddressDetailResponse,
  UserDetailResponse,
} from '../../domains/responses/userDetail.response';
import { UpdateSellerDto } from '../../domains/dtos/updateSeller.dto';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async updateSellerFollower(
    user: UserData,
    sellerId: number,
  ): Promise<ApiResponseDto<boolean>> {
    try {
      const sellerFollowerId = await this.prisma.sellerFollower.upsert({
        where: {
          sellerId_userId: { sellerId, userId: user.id },
        },
        select: { id: true },
        update: { updatedAt: new Date() },
        create: {
          sellerId,
          userId: user.id,
        },
      });

      if (!sellerFollowerId) {
        return ApiResponseDto.error('Cannot updating seller follower', 401);
      }

      return ApiResponseDto.success(
        'Seller follower successfully updated',
        !!sellerFollowerId,
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Unexpected error while updating seller follower',
      );
    }
  }

  async getSellerFollower(sellerId: number): Promise<ApiResponseDto<number>> {
    try {
      const followerCount = await this.prisma.sellerFollower.count({
        where: {
          sellerId: sellerId,
        },
      });

      if (!followerCount) {
        return ApiResponseDto.error('Seller follower not found', 404);
      }

      return ApiResponseDto.success(
        'Seller follower successfully got',
        followerCount,
      );
    } catch (error) {
      return ApiResponseDto.error(
        'Unexpected error while getting seller follower',
      );
    }
  }

  async getUserDetail(id: number): Promise<ApiResponseDto<UserDetailResponse>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
          role: true,
          seller: { select: { id: true } },
          addresses: {
            select: {
              province: { select: { id: true, name: true } },
              city: { select: { id: true, name: true } },
              subdistrict: { select: { id: true, name: true } },
              ward: { select: { id: true, name: true } },
              streetName: true,
              detail: true,
            },
          },
        },
      });

      if (!user) {
        return ApiResponseDto.error('User not found', 404);
      }

      return ApiResponseDto.success(
        'Detail user successfully got',
        new UserDetailResponse({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_seller: !!user.seller,
          avatar_url: user.avatarUrl,
          addresses: user.addresses.map<AddressDetailResponse>((adr) => {
            return new AddressDetailResponse({
              province_id: adr.province?.id ?? 0,
              province_name: adr.province?.name ?? '',
              city_id: adr.city?.id ?? 0,
              city_name: adr.city?.name ?? '',
              subdistrict_id: adr.subdistrict?.id ?? 0,
              subdistrict_name: adr.subdistrict?.name ?? '',
              ward_id: adr.ward?.id ?? 0,
              ward_name: adr.ward?.name ?? '',
              street_name: adr.streetName ?? '',
              detail_address: adr.detail ?? '',
            });
          }),
        }),
      );
    } catch (error) {
      return ApiResponseDto.error('Unexpected error while get user detail');
    }
  }

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

  async updateUserSeller(
    dto: UpdateSellerDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>> {
    try {
      const result = await this.prisma.$transaction(async (tx) => {
        // Create or update the address safely
        let newAddress;
        if (dto.address_id) {
          const existingAddress = await tx.address.findUnique({
            where: { id: dto.address_id },
            select: { userId: true },
          });

          if (!existingAddress || existingAddress.userId !== user.id) {
            throw new Error('Invalid address ID');
          }

          newAddress = await tx.address.update({
            where: { id: dto.address_id },
            data: {
              provinceId: dto.province_id,
              cityId: dto.city_id,
              subdistrictId: dto.subdistrict_id,
              wardId: dto.ward_id,
              streetName: dto.street_name,
              detail: dto.address_detail,
              updatedAt: new Date(),
            },
            select: { id: true },
          });
        } else {
          newAddress = await tx.address.create({
            data: {
              userId: user.id,
              provinceId: dto.province_id,
              cityId: dto.city_id,
              subdistrictId: dto.subdistrict_id,
              wardId: dto.ward_id,
              streetName: dto.street_name,
              detail: dto.address_detail,
            },
            select: { id: true },
          });
        }

        // Upsert seller details
        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            seller: {
              upsert: {
                update: {
                  merchantName: dto.merchant_name,
                  merchantLogoUrl: dto.merchant_logo_url,
                  detailLocation: dto.address_detail,
                  addressId: newAddress.id,
                },
                create: {
                  merchantName: dto.merchant_name,
                  merchantLogoUrl: dto.merchant_logo_url,
                  detailLocation: dto.address_detail,
                  addressId: newAddress.id,
                },
              },
            },
          },
          select: {
            id: true,
            email: true,
            name: true,
            avatarUrl: true,
            phoneNumber: true,
            role: true,
          },
        });

        return updatedUser;
      });

      return ApiResponseDto.success(
        'Seller data successfully updated',
        new UserResponse({
          id: result.id,
          email: result.email,
          name: result.name,
          avatar_url: result.avatarUrl,
          phone_number: result.phoneNumber,
          role: result.role,
        }),
      );
    } catch (error) {
      return ApiResponseDto.error(
        error.message || 'Unexpected error while updating seller',
      );
    }
  }

  async updateUserCore(
    { name, email, password, avatar_url, phone_number }: UpdateUserDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!existingUser) {
      return ApiResponseDto.error('User not found', 404);
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          email,
          avatarUrl: avatar_url,
          phoneNumber: phone_number,
          ...(password && { password: await bcrypt.hash(password, 10) }),
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          phoneNumber: true,
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
          phone_number: updatedUser.phoneNumber,
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
          phone_number: user.phoneNumber, 
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
          phone_number: newUser.phoneNumber,
          role: newUser.role,
          token,
        }),
      );
    } catch (err) {
      return ApiResponseDto.error('Unexpected error');
    }
  }
}
