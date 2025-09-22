import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export class UserData {
    name: string;
    id: number;
    iat: number;
    exp: number
}

export const User = createParamDecorator((_, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
});
