/* eslint-disable prettier/prettier */
import { Injectable,  } from '@nestjs/common';
//import { InjectRepository } from '@nestjs/typeorm';
//import { Repository } from 'typeorm';
//import { Organization } from './entity/organization';
//import { OrganizationRepository } from './app.repository';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello!';
  }

}


