import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, RemoveEvent } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { AuditTrail } from '../model/Audittrail.entity';
import { RolePermission } from '../model/role-permission.entity';
import { Permission } from '../model/permission.entity';
import { Role } from '../model/role.entity';
import { RoleService } from '../role/role.service';
import { PermissionService } from '../permission/permission.service'; 
import { RolePermissionService} from '../role-permission/role-permission.service'

@EventSubscriber()
@Injectable()
export class AuditTrailSubscriber implements EntitySubscriberInterface {
  private static entitiesToMonitor: Function[] = [
    Role,
    Permission, 
    RolePermission
  ];

  // Map entities to their respective soft delete services
  private static entityToServiceMap = {
    Role: RoleService,
    Permission: PermissionService,
    RolePermission: RolePermissionService
  };

  constructor(
    private readonly roleService: RoleService, 
    private readonly permissionService: PermissionService,
    private readonly rolePermissionService: RolePermissionService,
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

    if (action === 'DELETE' && 'databaseEntity' in event) {
      auditTrail.data = event.databaseEntity;
    } else {
      auditTrail.data = event.entity;
    }

    auditTrail.createdAt = new Date();

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
      case PermissionService:
        return this.permissionService.softDeletePermission.bind(this.permissionService);
      case RolePermissionService:
        return this.rolePermissionService.softDeleteRolePermission.bind(this.rolePermissionService);
      // Add cases for other services here as needed
      default:
        throw new Error('No soft delete service found for this entity');
    }
  }
}
