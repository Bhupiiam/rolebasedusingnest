import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

@Post('/signup')
signup(@Body() cred: AuthCredentialsDto): Promise<void> {
    console.log('Received credentials:', cred); 
    return this.authservice.signup(cred);
  }
  @Post('/signin')
  signin(@Body() cred:AuthCredentialsDto):Promise<{accessToken:string}>{
    console.log("The user is ",cred)
    return this.authservice.signin(cred)
  }
  
  
}
