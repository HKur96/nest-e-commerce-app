import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { SignInDto } from '../../domains/dtos/signIn.dto';
import { UpdateUserDto } from '../../domains/dtos/updateUser.dto';
import { UserData } from '@/utils/decorators/user.decorator';
import { UpsertAddressDto } from '../../domains/dtos/upsertAddress.dto';
import { UserDetailResponse } from '../../domains/responses/userDetail.response';
import { UpdateSellerDto } from '../../domains/dtos/updateSeller.dto';

@Injectable()
export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(dto: SignUpDto): Promise<ApiResponseDto<UserResponse>> {
    return await this.userRepository.signUp(dto);
  }

  async signIn(dto: SignInDto): Promise<ApiResponseDto<UserResponse>> {
    return await this.userRepository.signIn(dto);
  }

  async getUserDetail(id: number): Promise<ApiResponseDto<UserDetailResponse>> {
    return await this.userRepository.getUserDetail(id);
  }

  async updateUserCore(
    dto: UpdateUserDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>> {
    return await this.userRepository.updateUserCore(dto, user);
  }

  async upsertUserAddress(
    dtos: UpsertAddressDto[],
    user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.userRepository.upsertUserAddress(dtos, user);
  }

  async updateUserSeller(
    dto: UpdateSellerDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>> {
    return await this.userRepository.updateUserSeller(dto, user);
  }

  async getSellerFollower(sellerId: number): Promise<ApiResponseDto<number>> {
    return await this.userRepository.getSellerFollower(sellerId);
  }
}
