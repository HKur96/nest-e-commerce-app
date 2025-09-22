import { Module } from '@nestjs/common';
import { UserController } from './application/controllers/user.controllers';
import { UserRepository } from './data/repositories/user.repository';
import { UserUseCase } from './data/use-cases/user.usecase';
import { PrismaModule } from '@/infra/config/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserRepository, UserUseCase],
})
export class UserModule {}
