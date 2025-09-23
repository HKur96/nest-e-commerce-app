import { PrismaService } from '@/infra/config/prisma/prisma.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserData } from '../decorators/user.decorator';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // check whether roles is set
    if (!roles?.length) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();
      const path = request.route?.path;

      if (path === '/auth/signin' || path === '/auth/signup') {
        return true;
      }

      const authHeader = request.headers['authorization'] ?? '';

      const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;

      if (!token) {
        throw new UnauthorizedException('Authorization token missing');
      }

      const decoded = (await this.decodeToken(token)) as UserData;

      const user = await this.prismaService.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (user?.role && !roles.includes(user?.role)) return false;

      request.user = decoded;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private async decodeToken(token: string) {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
