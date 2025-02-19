import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeORMError } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AdminGuard } from './admin.guard';
import { LogsRepository } from 'src/tasks/logs.repository';


@Module({
  imports:[PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret:"topst1",
      signOptions:{
        expiresIn:3600, 
      }
    }),
    TypeOrmModule.forFeature([UserRepository,LogsRepository])],
  providers: [AuthService,JwtStrategy,AdminGuard],
  controllers: [AuthController],
  exports:[JwtStrategy,PassportModule]
})
export class AuthModule {}
