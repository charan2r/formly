import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditTrailRepository } from './AuditTrail.repository';
import { AuditTrail } from '../model/AuditTrail.entity';

@Injectable()
export class AuditTrailService {
  constructor(
    private readonly auditTrailRepository: AuditTrailRepository
  ) {}

  // Fetch all audit trails
  async getAll(): Promise<AuditTrail[]> {
    return this.auditTrailRepository.find();
  }

  // Fetch all audit trails for Admin
  async getAllForAdmin(): Promise<AuditTrail[]> {
    return this.auditTrailRepository.find({ where: { type: 'admin' } });
  }

  // Fetch all audit trails for SuperAdmin
  async getAllForSuperAdmin(): Promise<AuditTrail[]> {
    return this.auditTrailRepository.find({ where: { type: 'superadmin' } });
  }

  // Get a single audit trail by ID
  async getById(id: string): Promise<AuditTrail> {
    const audit = await this.auditTrailRepository.findOne({ where: { id } });
    if (!audit) {
      throw new NotFoundException(`AuditTrail with id ${id} not found`);
    }
    return audit;
  }

  // Add this method to fetch top 5 activities for SuperAdmin
  async getTop5ForSuperAdmin(): Promise<AuditTrail[]> {
    return this.auditTrailRepository.find({
      where: { type: 'superadmin' },
      order: { createdAt: 'DESC' },
      take: 5,
    });
  }
}
