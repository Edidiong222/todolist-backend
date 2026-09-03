import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpException } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { CreateTodolistDto } from './dto/create-todolist.dto';
import type { Request } from 'express';
import { UpdateTodolistDto } from './dto/update-todolist.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'guard/role.guard';
import { Roles } from 'guard/role';
import { User } from 'src/user/entities/user.entity';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Post()
  @UseGuards(AuthGuard(), RoleGuard)
  @Roles('user', 'admin')
  create(@Body() createTodolistDto: CreateTodolistDto, @Req() req: Request) {
    return this.todolistService.create(createTodolistDto, req.user as User);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Req() req) {
     if (req.user.role !== 'admin') {
    throw new HttpException('Admins only', 401);
  }
    return this.todolistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todolistService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodolistDto: UpdateTodolistDto) {
    return this.todolistService.update(+id, updateTodolistDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todolistService.remove(+id);
  }
}
