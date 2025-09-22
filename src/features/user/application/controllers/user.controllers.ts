import { Controller, Post, Body, Get } from '@nestjs/common';
import {  UserUseCase } from '../../data/use-cases/user.usecase';
import { SignInDto } from '@/features/user/domains/dtos/signIn.dto';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponse } from '@/utils/response/api.response';

@Controller('auth')
export class UserController {
  constructor(private readonly useCase: UserUseCase) {}

  @Post('/sign-up')
  async createUser(@Body() dto: SignUpDto): Promise<ApiResponse<UserResponse>> {
    return await this.useCase.signUp(dto);
  }
}
