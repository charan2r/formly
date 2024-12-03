import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { AuditTrailService } from './AuditTrail.service';
import { AuditTrail } from '../model/AuditTrail.entity';


export class ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}


@Controller('audit-trail')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}


  //get fetch all 
  @Get()
  async getAll(): Promise<ApiResponse<AuditTrail[]>> {
    const audits = await this.auditTrailService.getAll();
    return {
        status: 'success',
        message: 'Audit logs retrieved successfully',
        data: audits,
    };
  }


  //get one 
  @Get(':id')
  async getById(@Param('id') id: string): Promise<ApiResponse<AuditTrail>> {
    try {
      const audit = await this.auditTrailService.getById(id);
      return {
        status: 'success',
        message: `Audit log with id ${id} retrieved successfully`,
        data: audit,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          status: 'error',
          message: error.message,
          data: null,
        };
      }
      throw error;
    }
  }

}
