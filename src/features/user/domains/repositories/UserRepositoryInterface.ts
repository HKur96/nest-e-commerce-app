import { ApiResponse } from '@/utils/response/api.response';
import { SignUpDto } from '../dtos/signUp.dto';
import { UserResponse } from '../responses/user.response';
import { SignInDto } from '../dtos/signIn.dto';
import { Role } from '@prisma/client';

export interface UserRepositoryInterface {
  signUp(role: Role, user: SignUpDto): Promise<ApiResponse<UserResponse>>;

  signIn(role: Role, dto: SignInDto): Promise<ApiResponse<UserResponse>>;
}
