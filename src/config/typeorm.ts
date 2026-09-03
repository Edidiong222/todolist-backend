import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Todolist } from 'src/todolist/entities/todolist.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

// Ensure dotenv parses your .env before reading process.env
config();

export const dataSourceOptions: DataSourceOptions = process.env.DATABASE_URL
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [User, Todolist],
      synchronize: true,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [User, Todolist],
      synchronize: true,
    };

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;