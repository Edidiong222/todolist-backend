import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule,  } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodolistModule } from './todolist/todolist.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';



@Module({
  imports: [
    UserModule,
    TodolistModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal:true,
    }),
  ],
  controllers: [],
  providers:[],
})
export class AppModule {}
