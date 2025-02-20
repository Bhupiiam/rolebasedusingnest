import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  Request,
  Put,
  Query,
} from '@nestjs/common';
import { update_user_dto } from './update_user_dto';
import { UserService } from './user.service';
import { AdminGuard } from 'src/auth/admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { AvailableRoles } from 'src/auth/role.enum';
import { User } from 'src/auth/user.entity';
import { update_self_dto } from './update_self_dto';
import { Logs } from '../logs.entity';
import { AuthService } from 'src/auth/auth.service';
// redirecting to the '/' default path
@Controller('/') 
export class TasksController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('/allusers')
  async getAllUsers(@Request() req, @Query('role') role: AvailableRoles): Promise<User[]> {
    if (req.user.roles === AvailableRoles.ADMIN) {
      return this.userService.getUsersByRole(role);
    }
    if (req.user.roles === AvailableRoles.MANAGER) {
      if (role === AvailableRoles.NORMAL || role === AvailableRoles.MANAGER) {
        return this.userService.getUsersByRole(role);
      }
      throw new UnauthorizedException("You are not allowed to view Admin users.");
    }
    if (req.user.roles === AvailableRoles.NORMAL && role === AvailableRoles.NORMAL) {
      return this.userService.getUsersByRole(role);
    }
    throw new UnauthorizedException("You are not authorized to view these users.");
  }
  @UseGuards(AuthGuard('jwt'), AdminGuard)  
  @Get('/allusersadmin')
  async getAllUsersadmin(@Request() req): Promise<User[]> {
    console.log('Admin is requesting all users');
    return this.userService.getAllUsersForAdmin();
  }

  @Put('/updateuser/:id')
  @UseGuards(AdminGuard)
  async updateUser(@Request() req,@Param('id') id: string, @Body() userdto: update_user_dto): Promise<User> {
    return this.userService.updateUser(id, userdto,req.user.username);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteUser(@Request() req,@Param('id') id: string): Promise<string> {
    return this.userService.deleteUser(id,req.user.username);
  }

  @UseGuards(AdminGuard)
  @Get('/info')
  info():Promise<String>{
    return this.userService.info();
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch('/update-profile')
  async updateSelf(@Request() req, @Body() updateself: update_self_dto): Promise<User> {
    return this.userService.updateSelf(req.user.username, updateself);
  }
  @Get('/showlogs')
  @UseGuards(AdminGuard)
  showlogs():Promise<Logs[]>{
    return this.userService.showlogs();
  }
  @Patch("/becomeadmin")
  @UseGuards(AuthGuard('jwt'))
  becomeadmin(@Request() req,@Body('password') pass:string):Promise<User>
  {
      return this.userService.becomeadmin(req.user.username,pass);
  }

}
