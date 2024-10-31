/* eslint-disable prettier/prettier */
import { Controller, Get, Delete, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Organization } from './entity/organization';

@Controller('organizations') 
export class AppController {
  constructor(private readonly appService: AppService) {}

  // GET /organizations - Get all organizations
  @Get()
  async getAllOrganizations(): Promise<Organization[]> {
    return this.appService.findAll();
  }

  // DELETE /organizations/:id - Delete an organization by ID
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) 
  async deleteOrganization(@Param('id') id: string): Promise<void> {
    await this.appService.deleteById(id);
  }

  // GET /organizations/hello - Test route
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
