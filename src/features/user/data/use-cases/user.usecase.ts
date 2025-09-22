import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { ApiResponse } from '@/utils/response/api.response';

@Injectable()
export class UserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async signUpBuyer(dto: SignUpDto): Promise<ApiResponse<UserResponse>> {
    return await this.userRepository.signUpBuyer(dto);
  }
}
