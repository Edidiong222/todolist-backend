import {  IsEmail, IsNotEmpty, isNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength,  } from "class-validator";
import {Role} from 'src/enum/role.enum'

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!:string;

    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsNotEmpty()
    @MinLength(8, {message:`Password is below 8 characters`})
    @MaxLength(16, {message:`Password should not be more than 16 characters`})
   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^\da-zA-Z]).{8,}$/, {
    message:
      'Password must contain at least one uppercase, one number and one special key',
  })
  password!:string;

 @IsOptional()
 role!:Role;

}
