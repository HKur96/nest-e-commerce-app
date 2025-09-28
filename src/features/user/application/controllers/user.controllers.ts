import { Controller, Post, Body, UseGuards, Patch, Put } from '@nestjs/common';
import { UserUseCase } from '../../data/use-cases/user.usecase';
import { SignInDto } from '@/features/user/domains/dtos/signIn.dto';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ApiTags, ApiCreatedResponse, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UpdateUserDto } from '../../domains/dtos/updateUser.dto';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { UpsertAddressDto } from '../../domains/dtos/upsertAddress.dto';

@ApiTags('Authentication')
@Controller('auth')
export class UserController {
  constructor(private readonly useCase: UserUseCase) {}

  @ApiCreatedResponse({ description: 'User successfully sign up' })
  @ApiResponse({
    status: 200,
    description: 'User successfully sign up',
    type: UserResponse,
  })
  @Post('/sign-up')
  async signUpBuyer(
    @Body() dto: SignUpDto,
  ): Promise<ApiResponseDto<UserResponse>> {
    return await this.useCase.signUp(dto);
  }

  @ApiCreatedResponse({ description: 'User successfully sign in' })
  @ApiResponse({
    status: 200,
    description: 'User successfully sign in',
    type: UserResponse,
  })
  @Post('/sign-in')
  async signInBuyer(
    @Body() dto: SignInDto,
  ): Promise<ApiResponseDto<UserResponse>> {
    return await this.useCase.signIn(dto);
  }

  @ApiCreatedResponse({
    description: 'Update user name, email, password, avatar url',
  })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @ApiResponse({
    status: 201,
    description: 'User successfully updated',
    type: UserResponse,
  })
  @Patch('/update')
  async updateUserCore(
    @Body() dto: UpdateUserDto,
    @User() user: UserData,
  ): Promise<ApiResponseDto<UserResponse>> {
    console.log(user);
    return await this.useCase.updateUserCore(dto, user);
  }

  @ApiCreatedResponse({ description: 'Update user address' })
  @UseGuards(AuthGuard)
  @Roles(Role.SELLER, Role.USER)
  @ApiResponse({
    status: 201,
    description: 'User address successfully updated',
    type: UserResponse,
  })
  @ApiBody({
    type: UpsertAddressDto,
    isArray: true,
  })
  @Put('/update/address')
  async upsertUserAddress(
    @Body() dtos: UpsertAddressDto[],
    @User() user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.useCase.upsertUserAddress(dtos, user);
  }
}
