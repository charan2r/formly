import React, { Fragment } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Overview from './Overview';
import DataTable from './organization/DataTable';
import CreateOrganization from './organization/CreateOrganization';
import ViewOrganization from './organization/ViewOrganization';
import EditOrganization from './organization/EditOrganization';
import ChangeOrganization from './organization/ChangeOrganization';
import UserOverview from './superAdmin/userOverview';
import Users from './Users';
import Template from './Template';
import Category from './Category';
import Role from '../components/role/Role';
import AddRole from '../components/role/AddRole';
import ViewRole from '../components/role/ViewRole';
import EditRole from '../components/role/EditRole';
import Form from './Form';
//import AddForm from './AddForm';


import LeftSidebar from './LeftSidebar';
import ViewTemplate from './ViewTemplate';
import { DragDropContext } from 'react-beautiful-dnd';
import { TemplateProvider } from '../context/TemplateContext';
import Login from './authentication/Login';


import FTReset from './authentication/FTReset';
import ProfileSettings from './ProfileSettings';
import SubUserOverview from './subUser/SubUserOverview';
import { SuperAdminRoutes } from '../routes/SuperAdminRoutes';
import { AdminRoutes } from '../routes/AdminRoutes';
import { SubUserRoutes } from '../routes/SubUserRoutes';
import { usePermissions } from '../hooks/usePermissions';


const LoadingScreen = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#F9F9F9',
      gap: 2,
    }}
  >
    <CircularProgress
      size={40}
      thickness={4}
      sx={{
        color: 'black', // Matches your theme
      }}
    />
    <Typography
      variant="body1"
      sx={{
        color: '#666',
        fontWeight: 500,
        marginTop: 1,
      }}
    >
      Loading...
    </Typography>
  </Box>
);
import AuditTrail from './AuditTrail';

const Background: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { hasAnyCrudPermission, hasSpecificPermission } = usePermissions();
  
  const isEditTemplate = location.pathname.match(/^\/edittemplate\/[^/]+$/);
  const isAuthPage = location.pathname === '/login' || 
                    location.pathname.startsWith('/auth/verify-email') || 
                    location.pathname.startsWith('/auth/reset-password');
  
  const isSuperAdmin = user?.userType === 'SuperAdmin';
  const isAdmin = user?.userType === 'Admin';
  const isSubUser = user?.userType === 'SubUser';

  const renderAuthenticatedRoutes = () => {
    if (!isAuthenticated) return null;

    if (isSuperAdmin) {
      return (
        <>
          <Route path="/overview" element={<Overview />} />
          <Route path="/organizations" element={<DataTable />} />
          <Route path="/create-organization" element={<CreateOrganization />} />
          <Route path="/view-organization/:orgId" element={<ViewOrganization />} />
          <Route path="/edit-organization/:orgId" element={<EditOrganization />} />
          <Route path="/change-organization/:orgId" element={<ChangeOrganization />} />
          <Route path="/audit-trail" element={<AuditTrail />} />
        </>
      );
    }

    if (isAdmin) {
      return (
        <>
          <Route path="/useroverview" element={<UserOverview />} />
          <Route path="/users" element={<Users />} />
          <Route path="/forms" element={<Form />} />
          <Route path="/templates" element={<Template />} />
          <Route path="/viewtemplate/:id" element={<ViewTemplate />} />
          <Route path="/roles" element={<Role />} />
          <Route path="/addrole" element={<AddRole />} />
          <Route path="/editrole/:roleId" element={<EditRole />} />
          <Route path="/viewrole/:roleId" element={<ViewRole />} />
        </>
      );
    }

    if (isSubUser) {
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
    }

    return null;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated and not on login page, redirect to login
  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and on login page, redirect based on user type
  if (isAuthenticated && isAuthPage) {
    if (user?.userType === 'Admin') {
      console.log('Admin user detected');
      return <Navigate to="/useroverview" replace />;
    } else if (user?.userType === 'SuperAdmin') {
      return <Navigate to="/overview" replace />;
    } else if (user?.userType === 'SubUser') {
      return <Navigate to="/useroverview" replace />;
    }
  }

  // If authenticated but on root path, redirect based on user type
  if (isAuthenticated && location.pathname === '/') {
    if (user?.userType === 'admin') {
      return <Navigate to="/useroverview" replace />;
    } else if (user?.userType === 'SuperAdmin') {
      return <Navigate to="/overview" replace />;
    } else if (user?.userType === 'SubUser') {
      return <Navigate to="/useroverview" replace />;
    }
  }

  const handleDragEnd = (result: any) => {
    return;
  };

  return (
    <TemplateProvider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', backgroundColor: '#F9F9F9' }}>
          {isAuthenticated && !isAuthPage && (
            isEditTemplate ? <LeftSidebar /> : <Sidebar />
          )}

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/verify-email" element={<FTReset />} />
            <Route path="/auth/reset-password" element={<FTReset />} />

            {/* Protected Routes */}
            <Route path="/profile-settings" element={<ProfileSettings />} />
            {renderAuthenticatedRoutes()}
            <Route path="*" element={
              isSuperAdmin ? 
                <Navigate to="/overview" replace /> : 
                <Navigate to="/useroverview" replace />
            } />
          </Routes>
        </Box>
      </DragDropContext>
    </TemplateProvider>
  );
};

export default Background;
