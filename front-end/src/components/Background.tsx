import React from 'react';
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
import UserOverview from './UserOverview';
import Users from './Users';
import Template from './Template';
import Category from './Category';
import LeftSidebar from './LeftSidebar';
import EditPageSettings from './RightSidebar';
import ViewTemplate from './ViewTemplate';
import { DragDropContext } from 'react-beautiful-dnd';
import { TemplateProvider } from '../context/TemplateContext';
import Login from './authentication/Login';
import ProtectedRoute from './authentication/ProtectedRoute';
import Role from './role/Role';
import AddRole from './role/AddRole';
import ViewRole from './role/ViewRole';
import EditRole from './role/EditRole';
import FTReset from './authentication/FTReset';

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
  
  const isEditTemplate = location.pathname.match(/^\/edittemplate\/[^/]+$/);
  const isAuthPage = location.pathname === '/login' || 
                    location.pathname.startsWith('/auth/verify-email') || 
                    location.pathname.startsWith('/auth/reset-password');
  const isSuperAdmin = user?.userType === 'SuperAdmin';
  const isAdmin = user?.userType === 'Admin';

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
    }
  }

  // If authenticated but on root path, redirect based on user type
  if (isAuthenticated && location.pathname === '/') {
    if (user?.userType === 'admin') {
      return <Navigate to="/useroverview" replace />;
    } else if (user?.userType === 'SuperAdmin') {
      return <Navigate to="/overview" replace />;
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
            isEditTemplate ? (
              <>
                <LeftSidebar />
                <EditPageSettings />
              </>
            ) : (
              <Sidebar />
            )
          )}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/verify-email" element={<FTReset />} />
            <Route path="/auth/reset-password" element={<FTReset />} />
            
            {/* Protected Routes */}
            {isAuthenticated && (
              <>
                {/* Admin Routes */}
                {isAdmin && (
                  <>
                    <Route path="/useroverview" element={<UserOverview />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/templates" element={<Template />} />
                    <Route path="/edittemplate/:formTemplateId" element={<EditPageSettings />} />
                    <Route path="/categories" element={<Category />} />
                    <Route path="/viewtemplate/:templateId" element={<ViewTemplate />} />
                    <Route path="/roles" element={<Role />} />
                    <Route path="/addrole" element={<AddRole />} />
                    <Route path="/editrole/:roleId" element={<EditRole />} />
                    <Route path="/viewrole/:roleId" element={<ViewRole />} />
                  </>
                )}

                {/* SuperAdmin Routes */}
                {isSuperAdmin && (
                  <>
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/organizations" element={<DataTable />} />
                    <Route path="/create-organization" element={<CreateOrganization />} />
                    <Route path="/view-organization/:orgId" element={<ViewOrganization />} />
                    <Route path="/Edit-organization/:orgId" element={<EditOrganization />} />
                    <Route path="/Change-organization/:orgId" element={<ChangeOrganization />} />
                  </>
                )}

                {/* Catch-all redirect */}
                <Route path="*" element={
                  isAdmin ? 
                    <Navigate to="/useroverview" replace /> :
                    <Navigate to="/overview" replace />
                } />
              </>
            )}
          </Routes>
        </Box>
      </DragDropContext>
    </TemplateProvider>
  );
};

export default Background;
