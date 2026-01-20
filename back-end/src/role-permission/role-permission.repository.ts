import { Repository, DataSource, } from 'typeorm';
import { RolePermission } from '../model/role-permission.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RolePermissionRepository extends Repository<RolePermission> {
    constructor(private dataSource: DataSource) {
        super(RolePermission, dataSource.createEntityManager());
      }
}

