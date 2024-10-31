/* eslint-disable prettier/prettier */
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  entities: [__dirname + "/src/entity/*.ts"],
  migrations: [__dirname + "/migrations/*.ts"],
  synchronize: true,
});

export default AppDataSource;