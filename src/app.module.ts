import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule,  } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodolistModule } from './todolist/todolist.module';
import { UserModule } from './user/user.module';
import { DatabaseModule } from './database/database.module';
import { User } from './user/entities/user.entity';
import dataSource, { dataSourceOptions } from './config/typeorm';



@Module({
  imports: [
    UserModule,
    TodolistModule,
    DatabaseModule,
    // TypeOrmModule.forRoot(dataSourceOptions),
    ConfigModule.forRoot({
      isGlobal:true,
    }),
  ],
  
  controllers: [AppController],
  providers:[AppService],
})
export class AppModule {}
