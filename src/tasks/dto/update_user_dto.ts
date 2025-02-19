import { AvailableRoles } from 'src/auth/role.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class update_user_dto {
  @IsOptional()
  @IsEnum (AvailableRoles,{message:
    'Role must be a valid role'
  })newrole?: AvailableRoles;
  @IsOptional()
  @IsString({message:'username must be a stirng'})
  newusername?: string;
}
