import { ApiResponse } from '@/utils/response/api.response';
import { SignUpDto } from '../dtos/signUp.dto';
import { UserResponse } from '../responses/user.response';
import { SignInDto } from '../dtos/signIn.dto';

export interface UserRepositoryInterface {
  signUpBuyer(user: SignUpDto): Promise<ApiResponse<UserResponse>>;

  signInBuyer(dto: SignInDto): Promise<ApiResponse<UserResponse>>;
}
