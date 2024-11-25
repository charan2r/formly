import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Overview from './Overview';
import DataTable from './DataTable';
import CreateOrganization from './CreateOrganization';
import ViewOrganization from './ViewOrganization';
import EditOrganization from './EditOrganization';
import ChangeOrganization from './ChangeOrganization';
import UserOverview from './UserOverview';
import Users from './Users';
import Template from './Template';
import Category from './Category';
import LeftSidebar from './LeftSidebar';
import EditPageSettings from './RightSidebar';
import ViewTemplate from './ViewTemplate';
import { DragDropContext } from 'react-beautiful-dnd';
import { TemplateProvider } from '../context/TemplateContext';


const Background: React.FC = () => {
  const location = useLocation();
  
  // Check if the current route matches /edittemplate/{id}
  const isEditTemplate = location.pathname.match(/^\/edittemplate\/[^/]+$/);

  const handleDragEnd = (result: any) => {
    // Let the individual components handle their own drag end logic
    return;
  };

  return (
    <TemplateProvider>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', backgroundColor: '#F9F9F9' }}>
          {/* Conditionally render Sidebar or LeftSidebar */}
          {isEditTemplate ? <LeftSidebar /> : <Sidebar />}
          
          <Routes>
            <Route path="/" element={<Navigate to="/overview" replace />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/useroverview" element={<UserOverview />} />
            <Route path="/organizations" element={<DataTable />} />
            <Route path="/users" element={<Users />} />
            <Route path='/templates' element={<Template />} />
            <Route path='/edittemplate/:formTemplateId' element={<EditPageSettings />} />
            <Route path='/categories' element={<Category />} />
            <Route path="/create-organization" element={<CreateOrganization />} />
            <Route path="/view-organization/:orgId" element={<ViewOrganization />} />
            <Route path="/Edit-organization/:orgId" element={<EditOrganization />} />
            <Route path="/Change-organization/:orgId" element={<ChangeOrganization />} />
            <Route path='/viewtemplate/:templateId' element={<ViewTemplate />} />
          </Routes>
        </Box>
      </DragDropContext>
    </TemplateProvider>
  );
};

export default Background;
