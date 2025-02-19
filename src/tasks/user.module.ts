import { Module } from '@nestjs/common';
import { TasksController } from './dto/user.controller';
import { UserService } from './dto/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from 'src/auth/users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { LogsRepository } from './logs.repository';

@Module({
  imports:[TypeOrmModule.forFeature([UserRepository,LogsRepository]),AuthModule],
  controllers: [TasksController],
  providers: [UserService],
})
export class UserModule {};
