/* eslint-disable prettier/prettier */
import { Controller, Get, } from '@nestjs/common';
import { AppService } from './app.service';
//import { Organization } from './entity/organization';

@Controller('') 
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
