import { useAuth } from '../context/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string) => {
    console.log('--- ---- -----',user?.permissions);
    console.log(permission);
    return user?.permissions?.includes(permission) || false;
  };

  const hasAnyCrudPermission = (resource: string) => {
    const permissions = [
      `View ${resource}`,
      `Create ${resource}`,
      `Edit ${resource}`,
      `Delete ${resource}`
    ];

    return permissions.some(permission => hasPermission(permission));
  };

  const hasSpecificPermission = (permission: string) => {
    return hasPermission(permission);
  };

  return { hasPermission, hasAnyCrudPermission, hasSpecificPermission };
}; 