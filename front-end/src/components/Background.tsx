import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Overview from './Overview';
import DataTable from './DataTable';
import CreateOrganization from './CreateOrganization';

const Background: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F9F9F9', width: '100vw', height: '100vh' }}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/organizations" element={<DataTable />} />
        <Route path="/create-organization" element={<CreateOrganization/>}/>
      </Routes>
    </Box>
  );
};

export default Background;
