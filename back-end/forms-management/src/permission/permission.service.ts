import { Injectable, NotFoundException } from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { Permission } from '../model/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: PermissionRepository,
  ) {}

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { status: 'active' },
    });
  }

  // Get a permission by ID
  async getPermissionById(permissionId: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { permissionId, status: 'active' },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }
}
