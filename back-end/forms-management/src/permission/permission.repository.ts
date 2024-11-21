import { Repository, DataSource, } from 'typeorm';
import { Permission } from '../model/permission.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
    constructor(private dataSource: DataSource) {
        super(Permission, dataSource.createEntityManager());
      }
}

