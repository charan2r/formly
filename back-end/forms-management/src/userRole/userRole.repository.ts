import { Repository, DataSource, } from 'typeorm';
import { UserRole } from 'src/model/UserRole.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRoleRepository extends Repository<UserRole> {
    constructor(private dataSource: DataSource) {
        super(UserRole, dataSource.createEntityManager());
      }
}

