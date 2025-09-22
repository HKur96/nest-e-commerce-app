export class UserResponse {
  email: string;
  name: string;
  token: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
