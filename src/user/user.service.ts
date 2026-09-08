import {
  HttpException,
  Injectable,
  NotFoundException,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import * as argon2 from 'argon2';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JwtService } from '@nestjs/jwt';

import type { Request, Response } from 'express';

import { loginDto } from './dto/login.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    private jwtService: JwtService,
  ) {}


  async create(payload: CreateUserDto) {

    const { email, password, ...rest } = payload;

    const user = await this.userRepo.findOne({
      where: { email: email },
    });

    if (user) {
      throw new HttpException(`User already exists`, 400);
    }

    const hashedPassword = await argon2.hash(password);

    const userDetails = await this.userRepo.save({
      email,
      password: hashedPassword,
      ...rest,
    });

    const userPayload = {
      id: userDetails.id,
      email: userDetails.email,
      role: userDetails.role,
    };

    return {
      access_token: await this.jwtService.signAsync(userPayload),
    };
  }


  async update(id, payload: UpdateUserDto) {

    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new HttpException(`User invalid`, 401);
    }

    await this.userRepo.update(id, payload);

    return {
      message: `User succesfully updated`,
    };
  }


  async deleteUser(id) {

    const user = await this.userRepo.findOneBy(id);

    if (!user) {
      throw new HttpException(`User invalid`, 401);
    }

    await this.userRepo.delete(id);

    return {
      message: `User succesfully deleted`,
    };
  }


  async findEmail(email) {

    const mail = await this.userRepo.findOneByOrFail({ email });

    if (!mail) {
      throw new HttpException(`User invalid`, 401);
    }

    return mail;
  }


  // ADDED: FIND USER BY ID
  async findById(id: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ id });
  }


  async signIn(
    payload: loginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {

    const { email, password } = payload;

    const user = await this.userRepo.findOneBy({ email });

    if (!user) {
      throw new HttpException(`No Email found`, 400);
    }

    const checkedPassword = await this.verifyPassword(
      user.password,
      password,
    );

    if (!checkedPassword) {
      throw new HttpException(`Password Invalid`, 400);
    }

    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    res.cookie('isAuthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000,
    });

    return res.send({
      access_token: token,
    });
  }


  async logout(
    @Req() req: Request,
    @Res() res: Response,
  ) {

    const clearCookie = res.clearCookie(`isAuthenticated`);

    const response = res.send(`User succesfully logged out`);

    return {
      clearCookie,
      response,
    };
  }


  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }


  async user(headers: any): Promise<any> {

    const authorizationHeader = headers.authorization;

    if (authorizationHeader) {

      const token = authorizationHeader.replace('Bearer ', '');

      try {

        const decoded = this.jwtService.verify(token);

        const id = decoded['id'];

        const user = await this.userRepo.findOneBy({ id });

        if (!user) {
          throw new NotFoundException();
        }

        return {
          id: id,
          name: user.name,
          email: user.email,
          role: user.role,
        };

      } catch (error) {

        throw new UnauthorizedException('Invalid token');

      }

    } else {

      throw new UnauthorizedException(
        'Invalid or missing bearer token',
      );

    }
  }


  async verifyPassword(
    hashedPassword: string,
    plainPaassword: string,
  ): Promise<boolean> {

    try {

      return await argon2.verify(
        hashedPassword,
        plainPaassword,
      );

    } catch (err) {

      return false;

    }
  }

}