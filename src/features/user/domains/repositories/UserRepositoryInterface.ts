import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { SignUpDto } from '../dtos/signUp.dto';
import { UserResponse } from '../responses/user.response';
import { SignInDto } from '../dtos/signIn.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { UserData } from '@/utils/decorators/user.decorator';
import { UpsertAddressDto } from '../dtos/upsertAddress.dto';

export interface UserRepositoryInterface {
  signUp(user: SignUpDto): Promise<ApiResponseDto<UserResponse>>;

  signIn(dto: SignInDto): Promise<ApiResponseDto<UserResponse>>;

  updateUserCore(
    dto: UpdateUserDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>>;

  upsertUserAddress(
    dtos: UpsertAddressDto[],
    user: UserData,
  ): Promise<ApiResponseDto<boolean>>;

  updateUserCart(): Promise<ApiResponseDto<UserResponse>>;

  updateUserSeller(): Promise<ApiResponseDto<UserResponse>>;
}
