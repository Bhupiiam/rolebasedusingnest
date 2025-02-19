import {
    CanActivate,
    ExecutionContext,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  
  @Injectable()
  export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context); 
  
      const request = context.switchToHttp().getRequest();
      const user = request.user; 
  
      if (!user) {
        console.log('User in AdminGuard:', user); 
        throw new NotFoundException('No such user exists in the database');
      }
  
      if (!user.roles.includes('ADMIN')) {
        console.log('Unauthorized: User does not have admin role.');
        throw new UnauthorizedException('You are not authorized to access this resource.');
      }
  
      if (!user.verified) {
        console.log('Unauthorized: User is not verified.');
        throw new UnauthorizedException('Your account is not verified.');
      }
      console.log("You are a admin")
      return true;
    }
  }
  