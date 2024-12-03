/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // https://docs.nestjs.com/openapi/introduction
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import 'reflect-metadata';
import * as cookieParser from 'cookie-parser';
import { PermissionService } from './permission/permission.service';

//import AppDataSource from 'ormconfig'; 

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: 'http://localhost:5173',  // Allow only specific domain
    methods: 'GET,POST,PUT,DELETE,PATCH',  // Allow only specific HTTP methods
    allowedHeaders: 'Content-Type, Authorization',  // Allow specific headers
    credentials: true,  // Allow credentials
  });

  app.use(cookieParser());

  const config = new DocumentBuilder()
  .setTitle('Forms .O')
  .setDescription('Forms management application')
  .setVersion('1.0')
  .addTag('forms')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


//this can remove temporey added to seed the db 
// Get an instance of PermissionService
const permissionService = app.get(PermissionService);

// Call the seedPermissions method to seed data on app start
await permissionService.seedPermissions();


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
