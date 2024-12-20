import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import { usePermissions } from '../hooks/usePermissions';
import SubUserOverview from '../components/subUser/SubUserOverview';
import Users from '../components/Users';
import Form from '../components/Form';
import Template from '../components/Template';
import ViewTemplate from '../components/ViewTemplate';
import Role from '../components/role/Role';
import AddRole from '../components/role/AddRole';
import EditRole from '../components/role/EditRole';
import ViewRole from '../components/role/ViewRole';

export const SubUserRoutes = () => {
  const { hasAnyCrudPermission, hasSpecificPermission } = usePermissions();

  return (
    <>
      <Route path="/useroverview" element={<SubUserOverview />} />
      
      {hasAnyCrudPermission('User') && 
        <Route path="/users" element={<Users />} />
      }
      
      {hasAnyCrudPermission('Form') && 
        <Route path="/forms" element={<Form />} />
      }
      
      {hasAnyCrudPermission('Template') && 
        <Route path="/templates" element={<Template />} />
      }
      
      {hasSpecificPermission('View Template') && 
        <Route path="/viewtemplate/:id" element={<ViewTemplate />} />
      }
      
      {hasAnyCrudPermission('Role') && 
        <Route path="/roles" element={<Role />} />
      }
      
      {hasSpecificPermission('Create Role') && 
        <Route path="/addrole" element={<AddRole />} />
      }
      
      {hasSpecificPermission('Edit Role') && 
        <Route path="/editrole/:roleId" element={<EditRole />} />
      }
      
      {hasSpecificPermission('View Role') && 
        <Route path="/viewrole/:roleId" element={<ViewRole />} />
      }
    </>
  );
}; 