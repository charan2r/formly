import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import Overview from '../components/Overview';
import DataTable from '../components/organization/DataTable';
import CreateOrganization from '../components/organization/CreateOrganization';
import ViewOrganization from '../components/organization/ViewOrganization';
import EditOrganization from '../components/organization/EditOrganization';
import ChangeOrganization from '../components/organization/ChangeOrganization';
import AuditTrail from '../components/AuditTrail';

export const SuperAdminRoutes = () => (
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