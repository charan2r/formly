import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Checkbox, Divider, IconButton
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';


interface Permissions {
  userManagement: boolean;
  createUsers: boolean;
  editUsers: boolean;
  deleteUsers: boolean;
  formManagement: boolean;
  createForm: boolean;
  viewForm: boolean;
  editForm: boolean;
}

const initialPermissionState: Permissions = {
  usermanagement: false,
  createusers: false,
  editusers: false,
  deleteusers: false,
  formmanagement: false,
  createform: false,
  viewform: false,
  editform: false,
};

function ViewRole() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
  });
  const [permissions, setPermissions] = useState<Permissions>(initialPermissionState);

  useEffect(() => {
    const fetchRoleData = async () => {
      try {
        // Fetch role details
        const roleResponse = await api.get(`/roles/${roleId}`);
        if (roleResponse.data.status === 'success') {
          setFormData({
            roleName: roleResponse.data.data.role,
            description: roleResponse.data.data.description,
          });
        }

        // Fetch all permissions
        const permissionsResponse = await api.get('/permissions');
        const permissionMap = {};
        permissionsResponse.data.forEach((perm: any) => {
          const normalizedName = perm.name.toLowerCase().replace(/[\s-]/g, '');
          permissionMap[normalizedName] = perm.permissionId;
        });

        // Fetch role permissions
        const rolePermissionsResponse = await api.get(`/role-permissions/${roleId}`);
        if (rolePermissionsResponse.data.status === 'success') {
          const newPermissions = { ...initialPermissionState };

          rolePermissionsResponse.data.data.forEach((assignedPerm: any) => {
            const matchingPerm = permissionsResponse.data.find(
              (p: any) => p.permissionId === assignedPerm.permissionId
            );
            if (matchingPerm) {
              const normalizedName = matchingPerm.name.toLowerCase().replace(/[\s-]/g, '');
              newPermissions[normalizedName] = true;
            }
          });

          // Update group headers
          newPermissions.userManagement = 
            ['createUsers', 'editUsers', 'deleteUsers']
              .every(perm => newPermissions[perm]);

          newPermissions.formManagement = 
            ['createForm', 'viewForm', 'editForm']
              .every(perm => newPermissions[perm]);

          setPermissions(newPermissions);
          console.log(newPermissions);
        }
      } catch (error: any) {
        console.error('Error fetching role data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch role data');
        navigate('/roles');
      }
    };

    if (roleId) {
      fetchRoleData();
    }
  }, [roleId, navigate]);

  const handleBack = () => {
    navigate('/roles');
  };

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
        <IconButton 
            sx={{ 
              backgroundColor: '#f5f5f5',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => navigate(-1)}
          >
            <KeyboardBackspaceRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Role Management
          </Typography>
        </Box>

        <Typography variant="h5" fontWeight="bold">View Role</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          View role permissions and details.
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" sx={{ marginTop: '20px', marginBottom: '-5px', marginLeft: '150px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: '16px', fontSize: '18px' }}>
          {formData.roleName}
        </Typography>
      </Box>

      <Typography variant="body2" color="textSecondary" sx={{ marginLeft: '150px', marginBottom: '20px', fontSize: '13px' }}>
        {formData.description}
      </Typography>

      {/* User Management Group */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px" marginTop="20px">
        <Typography variant="subtitle1" fontWeight="bold">User Management</Typography>
        <Checkbox checked={permissions.usermanagement} disabled sx={{ color: 'black' }} />
      </Box>
      <Divider />
      {/* ... Rest of the checkboxes with their respective permission values ... */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Create Users</Typography>
        <Checkbox checked={permissions.createusers} disabled sx={{ color: 'black' }} />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Edit Users</Typography>
        <Checkbox checked={permissions.editusers} disabled sx={{ color: 'black' }} />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Delete Users</Typography>
        <Checkbox checked={permissions.deleteusers} disabled sx={{ color: 'black' }} />
      </Box>
      <Divider sx={{ marginY: '16px' }} />

      {/* Form Management Group */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px">
        <Typography variant="subtitle1" fontWeight="bold">Form Management</Typography>
        <Checkbox checked={permissions.formmanagement} disabled sx={{ color: 'black' }} />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Create Form</Typography>
        <Checkbox checked={permissions.createform} disabled sx={{ color: 'black' }} />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>View Form</Typography>
        <Checkbox checked={permissions.viewform} disabled sx={{ color: 'black' }} />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Edit Form</Typography>
        <Checkbox checked={permissions.editform} disabled sx={{ color: 'black' }} />
      </Box>
    </Paper>
  );
}

export default ViewRole;
