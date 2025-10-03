import { ApiResponseDto } from '@/utils/response/api.response.dto';
import { SignUpDto } from '../dtos/signUp.dto';
import { UserResponse } from '../responses/user.response';
import { SignInDto } from '../dtos/signIn.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
import { UserData } from '@/utils/decorators/user.decorator';
import { UpsertAddressDto } from '../dtos/upsertAddress.dto';
import { UserDetailResponse } from '../responses/userDetail.response';
import { UpdateSellerDto } from '../dtos/updateSeller.dto';

export interface UserRepositoryInterface {
  signUp(user: SignUpDto): Promise<ApiResponseDto<UserResponse>>;

  signIn(dto: SignInDto): Promise<ApiResponseDto<UserResponse>>;

  updateUserCore(
    dto: UpdateUserDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>>;

  getUserDetail(id: number): Promise<ApiResponseDto<UserDetailResponse>>;

  upsertUserAddress(
    dtos: UpsertAddressDto[],
    user: UserData,
  ): Promise<ApiResponseDto<boolean>>;

  updateUserSeller(
    dto: UpdateSellerDto,
    user: UserData,
  ): Promise<ApiResponseDto<UserResponse>>;

  getSellerFollower(sellerId: number): Promise<ApiResponseDto<number>>;
}
