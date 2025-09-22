import { ApiResponse } from '@/utils/response/api.response';
import { SignUpDto } from '../dtos/signUp.dto';
import { UserResponse } from '../responses/user.response';

export interface UserRepositoryInterface {
  signUpBuyer(user: SignUpDto): Promise<ApiResponse<UserResponse>>;
}
