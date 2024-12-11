import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import {
  Paper, Typography, Box, Checkbox, Divider, IconButton, TextField, Button, Grid
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
 


interface Role {
  roleId: string;
  role: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Permission {
  permissionId: string;
  name: string;
  status: string;
}

interface FormData {
  roleName: string;
  description: string;
}

interface PermissionGroups {
  userManagement: Permission[];
  formManagement: Permission[];
}

interface SelectedPermissions {
  [key: string]: boolean;
}

interface RoleResponse {
  status: string;
  message: string;
  data: {
    roleId: string;
    role: string;
    description: string;
    organizationId: string;
    createdAt: string;
  };
}

interface RolePermissionResponse {
  status: string;
  message: string;
  data: any; // Update this with proper type if needed
}

function AddRole() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    roleName: '',
    description: '',
  });

  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions>({});
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroups>({
    userManagement: [],
    formManagement: []
  });

  // Fetch permissions when component mounts
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.get('/permissions');
        console.log(response.data);
        const permissions = response.data;
        
        // Group permissions
        const grouped = permissions.reduce((acc: PermissionGroups, permission: Permission) => {
          if (permission.name.toLowerCase().includes('user')) {
            acc.userManagement.push(permission);
          } else if (permission.name.toLowerCase().includes('form')) {
            acc.formManagement.push(permission);
          }
          return acc;
        }, { userManagement: [], formManagement: [] });

        setPermissionGroups(grouped);
        setAvailablePermissions(permissions);
        
        // Initialize selected permissions
        const initialSelected = permissions.reduce((acc: SelectedPermissions, permission: Permission) => {
          acc[permission.permissionId] = false;
          return acc;
        }, {});
        setSelectedPermissions(initialSelected);
      } catch (error) {
        toast.error('Failed to fetch permissions');
      }
    };

    fetchPermissions();
  }, []);

  const handlePermissionChange = (permissionId: string) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [permissionId]: !prev[permissionId]
    }));
  };

  const handleGroupChange = (groupPermissions: Permission[]) => {
    const allChecked = groupPermissions.every(p => selectedPermissions[p.permissionId]);
    
    setSelectedPermissions(prev => {
      const updated = { ...prev };
      groupPermissions.forEach(permission => {
        updated[permission.permissionId] = !allChecked;
      });
      return updated;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      // First create the role
      const roleResponse = await api.post<RoleResponse>('/roles', {
        role: formData.roleName,
        description: formData.description,
        status: 'active'
      });

      if (roleResponse.data.status !== 'success') {
        throw new Error(roleResponse.data.message);
      }

      const roleId = roleResponse.data.data.roleId;

      // Get selected permission IDs
      const selectedPermissionIds = Object.entries(selectedPermissions)
        .filter(([_, isSelected]) => isSelected)
        .map(([permissionId]) => permissionId);

      if (selectedPermissionIds.length === 0) {
        throw new Error('Please select at least one permission');
      }

      // Then assign permissions to the role
      const permissionResponse = await api.post<RolePermissionResponse>(
        `/role-permissions/${roleId}`,
        {
          permissionIds: selectedPermissionIds
        }
      );

      if (permissionResponse.data.status !== 'success') {
        // If permissions assignment fails, we might want to delete the role
        // or handle this case appropriately
        throw new Error(permissionResponse.data.message);
      }

      toast.success('Role and permissions created successfully!');
      navigate('/roles');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to create role');
    }
  };

  // Add function to fetch role permissions if editing
  const fetchRolePermissions = async (roleId: string) => {
    try {
      const response = await api.get<{
        status: string;
        data: { permissionId: string }[];
      }>(`/role-permissions/${roleId}`);

      if (response.data.status === 'success') {
        // Update selected permissions state
        const permissionState = response.data.data.reduce(
          (acc, { permissionId }) => ({
            ...acc,
            [permissionId]: true
          }),
          {}
        );
        setSelectedPermissions(permissionState);
      }
    } catch (error: any) {
      toast.error('Failed to fetch role permissions');
    }
  };

  // Add function to update role permissions
  const updateRolePermissions = async (roleId: string) => {
    try {
      const selectedPermissionIds = Object.entries(selectedPermissions)
        .filter(([_, isSelected]) => isSelected)
        .map(([permissionId]) => permissionId);

      if (selectedPermissionIds.length === 0) {
        throw new Error('Please select at least one permission');
      }

      const response = await api.patch<RolePermissionResponse>(
        `/role-permissions/${roleId}`,
        {
          permissionIds: selectedPermissionIds
        }
      );

      if (response.data.status !== 'success') {
        throw new Error(response.data.message);
      }

      toast.success('Role permissions updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update permissions');
    }
  };

  // Add function to remove a single permission from role
  const removePermissionFromRole = async (roleId: string, permissionId: string) => {
    try {
      const response = await api.delete<{
        status: string;
        message: string;
      }>(`/role-permissions/${roleId}/${permissionId}`);

      if (response.data.status === 'success') {
        setSelectedPermissions(prev => ({
          ...prev,
          [permissionId]: false
        }));
        toast.success('Permission removed successfully');
      }
    } catch (error: any) {
      toast.error('Failed to remove permission');
    }
  };

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      {/* Top Navigation Section */}
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
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Atlas corp.
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Create a Role
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Create a Role</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          Create a new Role
        </Typography>
      </Box>

      {/* Input Fields and Create Button */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={5} display="flex" alignItems="center">
          <Typography variant="body2" sx={{ marginRight: '8px', marginLeft: '25px', minWidth: '70px', color: 'black' }}>
            Role Name
          </Typography>
          <TextField
            name="roleName"
            value={formData.roleName}
            onChange={handleInputChange}
            fullWidth
            placeholder="Enter role name"
            InputProps={{
              sx: { 
                backgroundColor: '#f9f9f9', 
                borderRadius: '5px', 
                fontSize: '12px', 
                padding: '-100px -100px',
                paddingY: '3px',
                paddingX: '6px',
                height: '30px'
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={5} display="flex" alignItems="center">
          <Typography variant="body2" sx={{ marginRight: '8px', marginLeft: '25px', minWidth: '70px', color: 'black' }}>
            Description
          </Typography>
          <TextField
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            placeholder="Enter role description"
            InputProps={{
              sx: { 
                backgroundColor: '#f9f9f9', 
                borderRadius: '5px', 
                fontSize: '12px', 
                padding: '-10px -10px',
                paddingY: '3px',
                paddingX: '6px',
                height: '30px'
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={2} display="flex" alignItems="center">
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '25px',
              paddingX: '20px',
              paddingY: '4px',
              fontSize: '14px',
              textTransform: 'none',
              marginLeft: '40px'
            }}
          >
            Create
          </Button>
        </Grid>
      </Grid>

      {/* User Management Group */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px" marginTop="20px">
        <Typography variant="subtitle1" fontWeight="bold">User Management</Typography>
        <Checkbox
          checked={permissionGroups.userManagement.every(p => selectedPermissions[p.permissionId])}
          onChange={() => handleGroupChange(permissionGroups.userManagement)}
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      {permissionGroups.userManagement.map(permission => (
        <React.Fragment key={permission.permissionId}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>{permission.name}</Typography>
            <Checkbox
              checked={selectedPermissions[permission.permissionId] || false}
              onChange={() => handlePermissionChange(permission.permissionId)}
              sx={{ color: 'black' }}
            />
          </Box>
          <Divider />
        </React.Fragment>
      ))}

      {/* Form Management Group */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px" marginTop="16px">
        <Typography variant="subtitle1" fontWeight="bold">Form Management</Typography>
        <Checkbox
          checked={permissionGroups.formManagement.every(p => selectedPermissions[p.permissionId])}
          onChange={() => handleGroupChange(permissionGroups.formManagement)}
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      {permissionGroups.formManagement.map(permission => (
        <React.Fragment key={permission.permissionId}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography>{permission.name}</Typography>
            <Checkbox
              checked={selectedPermissions[permission.permissionId] || false}
              onChange={() => handlePermissionChange(permission.permissionId)}
              sx={{ color: 'black' }}
            />
          </Box>
          <Divider />
        </React.Fragment>
      ))}
    </Paper>
  );
}

export default AddRole;