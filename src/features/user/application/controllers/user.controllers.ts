import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Put,
  Get,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { UserUseCase } from '../../data/use-cases/user.usecase';
import { SignInDto } from '@/features/user/domains/dtos/signIn.dto';
import { SignUpDto } from '@/features/user/domains/dtos/signUp.dto';
import { UserResponse } from '@/features/user/domains/responses/user.response';
import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { ApiTags, ApiResponse, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateUserDto } from '../../domains/dtos/updateUser.dto';
import { AuthGuard } from '@/utils/guards/auth.guard';
import { User, UserData } from '@/utils/decorators/user.decorator';
import { Roles } from '@/utils/decorators/role.decorator';
import { Role } from '@prisma/client';
import { UpsertAddressDto } from '../../domains/dtos/upsertAddress.dto';
import { UserDetailResponse } from '../../domains/responses/userDetail.response';
import { UpdateSellerDto } from '../../domains/dtos/updateSeller.dto';

@ApiTags('Authentication')
@Controller('auth')
export class UserController {
  constructor(private readonly useCase: UserUseCase) {}

  @ApiOperation({ summary: 'Endpoint to sign up' })
  @ApiResponse({
    status: 200,
    description: 'User successfully sign up',
    type: UserResponse,
  })
  @Post('/signup')
  async signUpBuyer(
    @Body() dto: SignUpDto,
  ): Promise<ApiResponseDto<UserResponse>> {
    return await this.useCase.signUp(dto);
  }

  @ApiOperation({ summary: 'Endpoint to sign in' })
  @ApiResponse({
    status: 200,
    description: 'User successfully sign in',
    type: UserResponse,
  })
  @Post('/signin')
  async signInBuyer(
    @Body() dto: SignInDto,
  ): Promise<ApiResponseDto<UserResponse>> {
    return await this.useCase.signIn(dto);
  }

  @ApiOperation({ summary: 'Endpoint to get user detail' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'User detail successfully got',
    type: UserDetailResponse,
  })
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @Get('/user')
  async getUserDetail(
    @User() user: UserData,
  ): Promise<ApiResponseDto<UserDetailResponse>> {
    return await this.useCase.getUserDetail(user.id);
  }

  @ApiOperation({
    summary: 'Endpoint to update user name, email, password, avatar url',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @ApiResponse({
    status: 200,
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

  @ApiOperation({ summary: 'Endpoint to update user address' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Roles(Role.SELLER, Role.USER)
  @ApiResponse({
    status: 200,
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

  @ApiOperation({ summary: 'Endpoint update seller data' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Roles(Role.SELLER)
  @ApiResponse({
    status: 200,
    description: 'Seller data successfully updated',
    type: UserResponse,
  })
  @ApiBody({
    type: UpdateSellerDto,
  })
  @Put('/update/seller')
  async updateSeller(
    @Body() dto: UpdateSellerDto,
    @User() user: UserData,
  ): Promise<ApiResponseDto<UserResponse>> {
    return await this.useCase.updateUserSeller(dto, user);
  }

  @ApiOperation({ summary: 'Endpoint to get seller follower' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN, Role.SELLER, Role.USER)
  @ApiResponse({
    status: 200,
    description: 'Seller follower successfully got',
    type: Number,
    example: 999,
  })
  @Get('/seller-follower/:sellerId')
  async getSellerFollower(
    @Param('sellerId', ParseIntPipe) sellerId: number,
  ): Promise<ApiResponseDto<number>> {
    return await this.useCase.getSellerFollower(sellerId);
  }

  @ApiOperation({ summary: 'Endpoint to update seller follower' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Roles(Role.USER)
  @ApiResponse({
    status: 200,
    description: 'Seller follower successfully updated',
    type: Boolean,
  })
  @Put('/seller-follower/:sellerId')
  async updateSellerFollower(
    @Param('sellerId', ParseIntPipe) sellerId: number,
    @User() user: UserData,
  ): Promise<ApiResponseDto<boolean>> {
    return await this.useCase.updateSellerFollower(user, sellerId);
  }
}
