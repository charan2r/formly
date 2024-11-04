/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
//import AppDataSource from 'ormconfig'; 

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',  // Allow only specific domain
    methods: 'GET,POST,PUT,DELETE',  // Allow only specific HTTP methods
    allowedHeaders: 'Content-Type, Authorization',  // Allow specific headers
    credentials: true,  // Allow credentials
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
