import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';

import { CreateTodolistDto } from './dto/create-todolist.dto';

import { UpdateTodolistDto } from './dto/update-todolist.dto';

import { InjectRepository } from '@nestjs/typeorm';

import { Todolist } from './entities/todolist.entity';

import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TodolistService {

  constructor(
    @InjectRepository(Todolist)
    private readonly todoRepo: Repository<Todolist>,
  ) {}


  async create(
    payload: CreateTodolistDto,
    user: User,
  ) {

    const todo = new Todolist();

    todo.userId = user.id;

    if (!user.id) {
      throw new HttpException(
        `ID not found`,
        400,
      );
    }

    todo.title = payload.description;

    Object.assign(todo, payload);

    this.todoRepo.create(todo);

    return await this.todoRepo.save(todo);
  }


  async findAll(user: User) {
  if (user.role === 'admin') {
    return this.todoRepo.find();
  }
  return this.todoRepo.find({ where: { userId: user.id } });
}

async findOne(id: string, user: User) {
  const todo = await this.todoRepo.findOneBy({ id });
  if (!todo) throw new NotFoundException('Todo not found');

  if (user.role !== 'admin' && todo.userId !== user.id) {
    throw new ForbiddenException('You do not have access to this todo');
  }
  return todo;
}

async update(id: string, dto: UpdateTodolistDto, user: User) {
  await this.findOne(id, user); // reuses the ownership check above
  await this.todoRepo.update(id, dto);
  return { message: 'Todo updated successfully' };
}

async remove(id: string, user: User) {
  await this.findOne(id, user); // reuses the ownership check above
  await this.todoRepo.delete(id);
  return { message: 'Todo deleted successfully' };
}
}