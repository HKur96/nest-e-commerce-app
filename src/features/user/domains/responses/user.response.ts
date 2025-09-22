export class UserResponse {
  id: number;
  email: string;
  name: string;
  token: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
