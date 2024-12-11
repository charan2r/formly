import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import UserOverview from '../components/superAdmin/userOverview';
import Users from '../components/Users';
import Form from '../components/Form';
import Template from '../components/Template';
import ViewTemplate from '../components/ViewTemplate';
import Role from '../components/role/Role';
import AddRole from '../components/role/AddRole';
import EditRole from '../components/role/EditRole';
import ViewRole from '../components/role/ViewRole';

export const AdminRoutes = () => (
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