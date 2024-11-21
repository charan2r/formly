import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Overview from './Overview';
import DataTable from './DataTable';
import CreateOrganization from './CreateOrganization';
import ViewOrganization from './ViewOrganization';
import EditOrganization from './EditOrganization';
import UserOverview from './UserOverview';
import Users from './Users';
import Template from './Template';
import Category from './Category';
import Role from './Role';
import AddRole from './AddRole';
import ViewRole from './ViewRole';
import EditRole from './EditRole';


const Background: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', backgroundColor: '#F9F9F9', width: '100vw', height: '100vh' }}>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/useroverview" element={<UserOverview />} />
        <Route path="/organizations" element={<DataTable />} />
        <Route path="/users" element={<Users />} />
        <Route path='/templates' element={<Template/>}/>
        <Route path='/categories' element={<Category/>}/>
        <Route path='/roles' element={<Role/>}/>
        <Route path="/create-organization" element={<CreateOrganization/>}/>
        <Route path="/add-role" element={<AddRole/>}/>
        <Route path="/view-organization/:orgId" element={<ViewOrganization></ViewOrganization>} />
        <Route path="/Edit-organization/:orgId" element={<EditOrganization/>}/>
        <Route path="/view-role/:roleId" element={<ViewRole/>}/>
        <Route path="/edit-role/:roleId" element={<EditRole/>}/>
        

      </Routes>
    </Box>
  );
};

export default Background;
