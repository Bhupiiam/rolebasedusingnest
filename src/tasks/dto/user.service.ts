import { GoneException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/auth/users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { AvailableRoles } from 'src/auth/role.enum';
import { update_user_dto } from './update_user_dto';
import { update_self_dto } from './update_self_dto';
import * as bcrypt from 'bcrypt';
import { LogAction, Logs } from '../logs.entity';
import { LogsRepository } from '../logs.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,private logsRepository:LogsRepository
  ) {}
  async getUsersByRole(role: AvailableRoles): Promise<User[]> {
    if (role === AvailableRoles.ADMIN) {
      return this.userRepository.find({ where: { roles: AvailableRoles.ADMIN } });
    }
    if (role === AvailableRoles.MANAGER) {
      return this.userRepository.find({ where: { roles: AvailableRoles.MANAGER } });
    }
    if (role === AvailableRoles.NORMAL) {
      return this.userRepository.find({ where: { roles: AvailableRoles.NORMAL } });
    }
    throw new UnauthorizedException("Invalid role provided.");
  }

  async updateUser(id: string, userdto: update_user_dto,upd:string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    
    const { newrole, newusername } = userdto;
    if (newrole) user.roles = newrole;
    if (newusername) user.username = newusername;
    await this.logsRepository.save({
      userId:user.username,
      updatedBy:upd,
      action:LogAction.ADMIN_UPDATE
    })
    await this.userRepository.save(user);
    return user;
  }
  async showlogs():Promise<Logs[]>{
    const found = await this.logsRepository.find()
    return found
  }
  async info():Promise<String>{
    const f1 = await this.userRepository.find({where:{roles:AvailableRoles.ADMIN}}
    )
    const f2 = await this.userRepository.find({where:{roles:AvailableRoles.MANAGER}}
    )
    const f3 = await this.userRepository.find({where:{roles:AvailableRoles.NORMAL}}
    )
    const adminCount = f1.length;
  const managerCount = f2.length;
  const normalCount = f3.length;

  return `Admins: ${adminCount}, Managers: ${managerCount}, Normals: ${normalCount}`;
  }
  async deleteUser(id: string,upd:string): Promise<string> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException("User not found");

    await this.userRepository.remove(user);
    await this.logsRepository.save({
      userId:user.username,
      updatedBy:upd,
      action:LogAction.ADMIN_UPDATE
    })
    return `Deleted user successfully: ${user.username}`;
  }

  async updateSelf(username: string, updateself: update_self_dto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) throw new NotFoundException("User not found");

    if (updateself.newusername) {
      user.username = updateself.newusername;
      await this.logsRepository.save({
        userId:username,
        updatedBy:username,
        action:LogAction.SELF_UPDATE
      })
    }
    if (updateself.newpassword) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(updateself.newpassword, salt);
      user.password = hashedPassword;
    }

    await this.userRepository.save(user);
    return user;
  }
  async getAllUsersForAdmin(): Promise<User[]> {
    const [admins, managers, normals] = await Promise.all([
      this.userRepository.find({ where: { roles: AvailableRoles.ADMIN } }),
      this.userRepository.find({ where: { roles: AvailableRoles.MANAGER } }),
      this.userRepository.find({ where: { roles: AvailableRoles.NORMAL } }),
    ]);

    return [...admins, ...managers, ...normals];
  }
  async becomeadmin(username:string,pass:string):Promise<User>{
    const found = await this.userRepository.findOne({where:{username}})
    if(!found)
    {
      throw new NotFoundException
    }
    if(found.roles === AvailableRoles.ADMIN)
    {
      throw new GoneException("You are already a admin")
    }
    if(pass === "Bhupi@1910")
    found.roles = AvailableRoles.ADMIN;
    else
    throw new UnauthorizedException("The password you entered is wrong")
    this.userRepository.save(found)
    return found;
  }
}
