import { ConfigModule, ConfigService } from '@nestjs/config';
import {config} from 'dotenv'
import { Todolist } from 'src/todolist/entities/todolist.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

config()

const configService=  new ConfigService()

export const dataSourceOptions:DataSourceOptions=({
        type:'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // entities:['dist/**/*.entity.js'],
        // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        entities:[User, Todolist],
        synchronize:true,
})

const dataSource = new DataSource(dataSourceOptions)
export default dataSource;