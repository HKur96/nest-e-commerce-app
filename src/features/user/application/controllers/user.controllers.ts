import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserUseCase } from '../../data/use-cases/user.usecase';
import { SignInDto } from '@/features/user/domains/dtos/signIn.dto';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponse } from '@/utils/response/api.response';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('auth')
export class UserController {
  constructor(private readonly useCase: UserUseCase) {}

  @Roles(Role.BUYER)
  @Post('/sign-up')
  async signUpBuyer(
    @Body() dto: SignUpDto,
  ): Promise<ApiResponse<UserResponse>> {
    return await this.useCase.signUpBuyer(dto);
  }

  @Roles(Role.BUYER)
  @Post('/sign-in')
  async signInBuyer(
    @Body() dto: SignInDto,
  ): Promise<ApiResponse<UserResponse>> {
    return await this.useCase.signInBuyer(dto);
  }
}
