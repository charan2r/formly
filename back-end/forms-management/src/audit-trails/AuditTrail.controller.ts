import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { AuditTrailService } from './AuditTrail.service';
import { AuditTrail } from '../model/AuditTrail.entity';
import { Permissions } from 'src/user/decorators/permissions.decorator';
import { Roles } from 'src/user/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/roles.guard';


export class ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}


@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('audit-trail')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}


  //get fetch all 
  @Get()
  @Roles('Admin','SuperAdmin')
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
  @Roles('Admin','SuperAdmin')
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
