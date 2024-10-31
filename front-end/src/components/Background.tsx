import React from 'react';
import Sidebar from './Sidebar';
import DataTable from './DataTable';
import { Box } from '@mui/material';

const Background: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F9F9F9', width: '100vw', height: '100vh' }}>
      <Sidebar />
      <DataTable/>
    </Box>
  );
};

export default Background;
