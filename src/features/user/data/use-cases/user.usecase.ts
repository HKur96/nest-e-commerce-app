import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { ApiResponse } from '@/utils/response/api.response';
import { SignInDto } from '../../domains/dtos/signIn.dto';
import { Role } from '@prisma/client';

@Injectable()
export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async signUp(
    role: Role,
    dto: SignUpDto,
  ): Promise<ApiResponse<UserResponse>> {
    return await this.userRepository.signUp(role, dto);
  }

  async signIn(
    role: Role,
    dto: SignInDto,
  ): Promise<ApiResponse<UserResponse>> {
    return await this.userRepository.signIn(role, dto);
  }
}
