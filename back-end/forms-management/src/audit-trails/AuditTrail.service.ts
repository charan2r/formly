import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditTrailRepository } from './AuditTrail.repository';


@Injectable()
export class AuditTrailService {
  constructor(
    private readonly auditTrailRepository: AuditTrailRepository
  ) {}


  //fetch all to audit trail
  async getAll() {
    const audits = await this.auditTrailRepository.find();
    return audits.map(audit => ({
        id: audit.id,
        tableName: audit.tableName,
        action: audit.action,
        createdAt: audit.createdAt,
        createdById: audit.createdById,
        data: audit.data,
    }));
 }


 //get one
 async getById(id: string) {
  const audit = await this.auditTrailRepository.findOne({ where: { id } });
  if (!audit) {
    throw new NotFoundException(`AuditTrail with id ${id} not found`);
  }
  return {
    id: audit.id,
    tableName: audit.tableName,
    action: audit.action,
    createdAt: audit.createdAt,
    createdById: audit.createdById,
    data: audit.data,
  };
}
}
