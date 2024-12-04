import { Controller, Get, Param, NotFoundException, UseGuards } from '@nestjs/common';
import { AuditTrailService } from './AuditTrail.service';
import { AuditTrail } from '../model/AuditTrail.entity';
import { Roles } from 'src/user/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/user/roles.guard';

export class ApiResponse<T> {
    status: string;
    message: string;
    type: string;
    data: T;
}

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('audit-trail')
export class AuditTrailController {
  constructor(private readonly auditTrailService: AuditTrailService) {}

  // Get all audit trails for Admin
  @Get('admin')
  @Roles('Admin')
  async getAllForAdmin(): Promise<ApiResponse<AuditTrail[]>> {
    const audits = await this.auditTrailService.getAllForAdmin();
    return {
      status: 'success',
      message: 'Admin audit logs retrieved successfully',
      data: audits,
      type: 'admin',
    };
  }

  // Get all audit trails for SuperAdmin
  @Get('superadmin')
  @Roles('SuperAdmin')
  async getAllForSuperAdmin(): Promise<ApiResponse<AuditTrail[]>> {
    const audits = await this.auditTrailService.getAllForSuperAdmin();
    return {
      status: 'success',
      message: 'SuperAdmin audit logs retrieved successfully',
      data: audits,
      type: 'superadmin',
    };
  }

  // Get a single audit trail by ID
  @Get(':id')
  @Roles('Admin', 'SuperAdmin')
  async getById(@Param('id') id: string): Promise<ApiResponse<AuditTrail>> {
    try {
      const audit = await this.auditTrailService.getById(id);
      return {
        status: 'success',
        message: `Audit log with id ${id} retrieved successfully`,
        data: audit,
        type: audit.type || 'admin', // Ensure type is set
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          status: 'error',
          message: error.message,
          data: null,
          type: 'admin',
        };
      }
      throw error;
    }
  }

  // Add this route to the controller
  @Get('superadmin/top5')
  @Roles('SuperAdmin')
  async getTop5ForSuperAdmin(): Promise<ApiResponse<AuditTrail[]>> {
    const audits = await this.auditTrailService.getTop5ForSuperAdmin();
    return {
      status: 'success',
      message: 'Top 5 SuperAdmin audit logs retrieved successfully',
      data: audits,
      type: 'superadmin',
    };
  }
}
