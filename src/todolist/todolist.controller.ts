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
@UseGuards(AuthGuard('jwt'))
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Post()
  @UseGuards(RoleGuard)
  @Roles('user', 'admin')
  create(@Body() createTodolistDto: CreateTodolistDto, @Req() req: Request) {
    return this.todolistService.create(createTodolistDto, req.user as User);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.todolistService.findAll(req.user as User);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.todolistService.findOne(id, req.user as User);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodolistDto: UpdateTodolistDto, @Req() req: Request) {
    return this.todolistService.update(id, updateTodolistDto, req.user as User);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.todolistService.remove(id, req.user as User);
  }
}