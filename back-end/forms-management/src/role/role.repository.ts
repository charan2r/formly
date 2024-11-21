import { Repository, DataSource, } from 'typeorm';
import { Role } from '../model/role.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoleRepository extends Repository<Role> {
    constructor(private dataSource: DataSource) {
        super(Role, dataSource.createEntityManager());
      }
}
