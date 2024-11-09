import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Overview from './Overview';
import DataTable from './DataTable';
import CreateOrganization from './CreateOrganization';
import ViewOrganization from './ViewOrganization';
import EditOrganization from './EditOrganization';

const Background: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F9F9F9', width: '100vw', height: '100vh' }}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/organizations" element={<DataTable />} />
        <Route path="/create-organization" element={<CreateOrganization/>}/>
        <Route path="/view-organization/:orgId" element={<ViewOrganization></ViewOrganization>} />
        <Route path="/Edit-organization/:orgId" element={<EditOrganization/>}/>
      </Routes>
    </Box>
  );
};

export default Background;
