import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuditTrail} from '../model/Audittrail.entity';

@Injectable()
export class AuditTrailRepository extends Repository<AuditTrail> {
  constructor(private dataSource: DataSource) {
    super(AuditTrail, dataSource.createEntityManager());
  }

  // custom methods here if needed
}