import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRoleRepository } from '../userRole/userRole.repository'; 
import { UserRepository } from 'src/user/user.repository';
import { RoleRepository } from 'src/role/role.repository';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  // Assign a role to a user
  async assignRoleToUser(userId: string, roleId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.userType !== 'SubUser') {
      throw new ForbiddenException('Roles can only be assigned to SubUsers.');
    }
  
    // Fetch the role along with its organization
    const role = await this.roleRepository.findOne({
      where: { roleId: roleId },
      relations: ['organization'],
    });
  
    if (!role) {
      throw new NotFoundException('Role not found');
    }
  
    if (user.organizationId !== role.organization.orgId) {
      throw new ForbiddenException(
        `Roles can only be assigned to users within the same organization.`,
      );
    }
    const existingUserRole = await this.userRoleRepository.findOne({
      where: { userId, roleId },
    });
  
    if (existingUserRole) {
      throw new ForbiddenException('User already has this role');
    }
    const userRole = this.userRoleRepository.create({
      userId,
      roleId,
    });
  
    await this.userRoleRepository.save(userRole);
  
    return userRole;
  }

   // Get all user roles
   async getAllUserRoles(_adminOrganizationId: any) {
    const userRoles = await this.userRoleRepository.find({
      relations: ['role', 'user'],
    });
  
    if (userRoles.length === 0) {
      throw new NotFoundException('No user roles found');
    }
    return userRoles.map(userRole => ({
      roleId: userRole.role.roleId,
      roleName: userRole.role.role,
      userId: userRole.user.id,
      userName: `${userRole.user.firstName} ${userRole.user.lastName}`,
    }));
  }
  

  // Get all roles associated with a specific user
async getUserRole(id: string) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId: id },
      relations: ['role', 'user'], 
    });
  
    if (userRoles.length === 0) {
      throw new NotFoundException('No roles found for the user');
    }
  
    // Return an array of roles with user and role details
    return userRoles.map(userRole => ({
      roleId: userRole.role.roleId,
      roleName: userRole.role.role,
      userId: userRole.user.id,
      userName: `${userRole.user.firstName} ${userRole.user.lastName}`,
    }));
  }

  // Update a user role
  async updateUserRole(id: string, updateData: Partial<{ userId: string; roleId: string }>) {
    const userRole = await this.userRoleRepository.findOne({ where: { userId : id } });
    if (!userRole) {
      throw new NotFoundException('User role not found');
    }

    Object.assign(userRole, updateData);
    return this.userRoleRepository.save(userRole);
  }

  // Soft delete a specific user role
  async deleteUserRole(id: string) {
    const userRole = await this.userRoleRepository.findOne({ where: { userId : id } });
    if (!userRole) {
      throw new NotFoundException('User role not found');
    }

    userRole.status = "deleted";
    return this.userRoleRepository.save(userRole);
  }

  // Bulk soft delete user roles
  async bulkDeleteUserRoles(ids: string[]) {
    const userRoles = await this.userRoleRepository.findByIds(ids);
    if (userRoles.length === 0) {
      throw new NotFoundException('No user roles found for the provided IDs');
    }

    userRoles.forEach((userRole) => (userRole.status = "delete"));
    return this.userRoleRepository.save(userRoles);
  }
}

