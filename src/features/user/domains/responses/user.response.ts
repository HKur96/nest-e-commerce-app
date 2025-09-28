import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  avatar_url: string;

  @ApiProperty()
  role: Role;

  @ApiProperty({ description: 'User token', default: 'eyaiuaiufkbj' })
  token: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
