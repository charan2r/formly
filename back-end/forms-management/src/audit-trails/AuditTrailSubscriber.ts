import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuditTrail } from 'src/model/AuditTrail.entity';
import { RolePermission } from '../model/role-permission.entity';
import { Permission } from '../model/permission.entity';
import { Role } from '../model/role.entity';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service'; 
import { RolePermissionService } from '../role-permission/role-permission.service';
import { Organization } from 'src/model/organization.entity';
import { OrganizationService } from 'src/organization/organization.service';
import { User } from 'src/model/user.entity';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/model/UserRole.entity';
import { UserRoleService } from 'src/userRole/userRole.service';

@EventSubscriber()
@Injectable({ scope: Scope.REQUEST })
export class AuditTrailSubscriber implements EntitySubscriberInterface {
  private static entitiesToMonitor: Function[] = [
    Role,
    Permission, 
    RolePermission,
    Organization,
    User,
    UserRole
  ];

  // Map entities to their respective soft delete services
  private static entityToServiceMap = {
    Role: RoleService,
    Permission: PermissionService,
    RolePermission: RolePermissionService,
    Organization: OrganizationService,
    User: UserService,
    UserRole: UserRoleService,
  };

  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly roleService: RoleService, 
    private readonly permissionService: PermissionService,
    private readonly rolePermissionService: RolePermissionService,
    private readonly organizationService: OrganizationService,
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly jwtService: JwtService
  ) {
    console.log('MONITORED_ENTITIES:', AuditTrailSubscriber.entitiesToMonitor);
  }

  listenTo() {
    return Object;
  }

  private isMonitoredEntity(target: string | Function): boolean {
    if (typeof target === 'function') {
      return AuditTrailSubscriber.entitiesToMonitor.includes(target);
    } else if (typeof target === 'string') {
      return AuditTrailSubscriber.entitiesToMonitor.some(entity => entity.name === target);
    }
    return false;
  }

  private async logAction(
    event: InsertEvent<any> | UpdateEvent<any> | RemoveEvent<any>,
    action: string,
  ) {
    if (!this.isMonitoredEntity(event.metadata.target)) {
      return;
    }

    const auditTrail = new AuditTrail();
    auditTrail.tableName = event.metadata.tableName;
    auditTrail.action = action;
    
    // Set the type based on the entity being changed
    auditTrail.type = event.metadata.target === Organization ? 'superadmin' : 'admin';

    try {
      const token = this.request?.headers?.authorization?.split(' ')[1];
      console.log('Request headers:', this.request?.headers); // Debug log
      console.log(
        'Authorization header:',
        this.request?.headers?.authorization,
      ); // Debug log
      console.log('token:', token); // Debug log
      if (token) {
        const decoded = this.jwtService.verify(token);
        auditTrail.createdById = decoded.userId;
      }
    } catch (error) {
      console.error('Token extraction error:', error); // Debug log
      auditTrail.createdById = null;
    }

    auditTrail.createdAt = new Date();

    if (action === 'DELETE' && 'databaseEntity' in event) {
      auditTrail.data = event.databaseEntity;
    } else {
      auditTrail.data = event.entity;
    }

    console.log('Audit Record to Save:', auditTrail);

    await event.manager.save(AuditTrail, auditTrail);
    console.log(`Logged ${action} for table ${event.metadata.tableName}`); // Log the action
  }

  // Event after entity insert
  async afterInsert(event: InsertEvent<any>) {
    await this.logAction(event, 'Create');
  }

  async afterUpdate(event: UpdateEvent<any>) {
    if (this.isMonitoredEntity(event.metadata.target)) {
      const { entity, databaseEntity } = event;
  
      if (entity && databaseEntity && 'status' in entity) {
        if (entity.status === 'deleted' && databaseEntity.status !== 'deleted') {
          await this.logAction(event, 'DELETE');
          return;
        }
      }
  
      // Default to logging as an UPDATE action
      await this.logAction(event, 'UPDATE');
    }
  }
  

   // Event after entity removal (soft delete handling for any monitored entity)
   async afterRemove(event: RemoveEvent<any>) {
    const entityName = event.entity.constructor.name;
    const service = AuditTrailSubscriber.entityToServiceMap[entityName];

    if (service) {
      const entityId = event.entity['id'];
      const deleteService = this.getDeleteService(service);
      
      const deleteResult = await deleteService(entityId);
      
      if (deleteResult) {
        await this.logAction(event, 'DELETE');
      }
    }
  }

  // Helper method to get the appropriate delete service method
  private getDeleteService(service: any) {
    switch (service) {
      case RoleService:
        return this.roleService.deleteRole.bind(this.roleService);
      // case PermissionService:
      //   return this.permissionService.softDeletePermission.bind(this.permissionService);
      // case RolePermissionService:
      //   return this.rolePermissionService.softDeleteRolePermission.bind(this.rolePermissionService);
      case OrganizationService:
        return this.organizationService.deleteOne.bind(this.organizationService);
      case UserService:
        return this.userService.deleteUser.bind(this.userService);
      case UserRoleService:
        return this.userRoleService.deleteUserRole.bind(this.userRoleService);
      // Add cases for other services here as needed
      default:
        throw new Error('No soft delete service found for this entity');
    }
  }
  
}
