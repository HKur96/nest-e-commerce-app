import { Controller, Post, Body, Param, ParseEnumPipe } from '@nestjs/common';
import { UserUseCase } from '../../data/use-cases/user.usecase';
import { SignInDto } from '@/features/user/domains/dtos/signIn.dto';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponse } from '@/utils/response/api.response';
import { Role } from '@prisma/client';
import { ParseLowercaseEnumPipe } from '@/utils/pipe/customParseRolePipe';

@Controller('auth')
export class UserController {
  constructor(private readonly useCase: UserUseCase) {}

  @Post('/sign-up/:role')
  async signUpBuyer(
    @Param('role', new ParseLowercaseEnumPipe<Role>(Role)) role: Role,
    @Body() dto: SignUpDto,
  ): Promise<ApiResponse<UserResponse>> {
    return await this.useCase.signUp(role, dto);
  }

  @Post('/sign-in/:role')
  async signInBuyer(
    @Param('role', new ParseLowercaseEnumPipe<Role>(Role)) role: Role,
    @Body() dto: SignInDto,
  ): Promise<ApiResponse<UserResponse>> {
    return await this.useCase.signIn(role, dto);
  }
}
