import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import type { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(+id);
  }

  @Post('/login')
  login(@Body() payload:loginDto, @Req() req: Request, @Res() res:Response){
    return this.userService.signIn(payload, req, res);
  }

  @Post('/logout')
  logout(@Req()req: Request, @Res() res:Response){
    return this.userService.logout( req, res);
  }

  @Get('/get')
  async findAll():Promise<User[]>{
    return await this.userService.findAll()
  }

}
