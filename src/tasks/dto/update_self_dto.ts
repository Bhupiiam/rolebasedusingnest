import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
  } from 'class-validator';
  
  export class update_self_dto{
    @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(20)
    newusername: string;
  
    @IsString()
    @IsOptional()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message:
        'your password must include symbool,character,and One capital Letter',
    })
    newpassword: string;
  }
  