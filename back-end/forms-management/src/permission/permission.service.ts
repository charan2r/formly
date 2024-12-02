import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PermissionRepository } from './permission.repository';
import { Permission } from '../model/permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: PermissionRepository,
  ) {}

   // Create a new permission
  async createPermission(name: string): Promise<Permission> {
    const permission = this.permissionRepository.create({
      name,
      createdAt: new Date(),
    });

    return this.permissionRepository.save(permission);
  }

  // Get all permissions
  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  // Get a permission
  async getPermissionById(permissionId: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { permissionId },
    });
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    return permission;
  }

  // Update
  async updatePermission(permissionId: string, name: string): Promise<Permission> {
    const permission = await this.getPermissionById(permissionId);
  
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Permission name cannot be empty or just whitespace');
    }
    const existingPermission = await this.permissionRepository.findOne({
      where: { name: name.trim() },
    });
  
    if (existingPermission && existingPermission.permissionId !== permissionId) {
      throw new BadRequestException('Permission with this name already exists');
    }
  
    permission.name = name;
    return this.permissionRepository.save(permission);
  }

  // Soft delete
  async softDeletePermission(permissionId: string): Promise<void> {
    const permission = await this.permissionRepository.findOne({
      where: { permissionId, status: 'active' },
    });

    if (!permission) {
      throw new NotFoundException('Permission not found or already deleted');
    }

    permission.status = 'deleted';

    await this.permissionRepository.save(permission);
  }

  //soft bulk delete 
  async bulkSoftDeletePermissions(permissionIds: string[]): Promise<Permission[]> {
    if (!permissionIds || permissionIds.length === 0) {
      throw new BadRequestException('No permission IDs provided for bulk deletion');
    }
  
    const permissions = await this.permissionRepository.find({
      where: { permissionId: In(permissionIds), status: 'active' },
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found or already deleted');
    }
  
    permissions.forEach(permission => {
      permission.status = 'deleted';
    });
  
    return this.permissionRepository.save(permissions);
  }
  
 // seed the permission table
  async seedPermissions() {
    const permissions: Partial<Permission>[] = [
      { name: 'Create Users' },
      { name: 'Edit Users' },
      { name: 'Delete Users' },
      { name: 'Create Form' },
      { name: 'View Form' },
      { name: 'Edit Form' },
    ];

    for (const permission of permissions) {
      const existingPermission = await this.permissionRepository.findOne({
        where: { name: permission.name },
      });
      if (!existingPermission) {
        await this.createPermission(permission.name);
      }
    }
  }
}
