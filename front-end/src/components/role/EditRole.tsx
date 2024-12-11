import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Checkbox, Divider, IconButton, TextField, Button
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Permissions {
  // Group headers
  userManagement: boolean;
  formManagement: boolean;
  // Individual permissions will be added dynamically with UUID keys
  [key: string]: boolean;
}

// Define initial permission state with all values explicitly set
const initialPermissionState: Permissions = {
  // Group headers
  usermanagement: false,
  formmanagement: false,
  // Individual permissions
  createusers: false,
  editusers: false,
  deleteusers: false,
  createform: false,
  viewform: false,
  editform: false
};

// Add a utility function to normalize permission names
const normalizePermissionName = (name: string): string => {
  // Convert "Edit Users" to "editUsers", "Create Form" to "createForm", etc.
  return name
    .toLowerCase()
    .replace(/\s+/g, '') // Remove spaces
    .replace(/^(create|edit|delete|view)/, (match) => 
      match.toLowerCase()
    );
};

function EditRole() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
  });

  // Initialize permissions with all values set to false
  const [permissions, setPermissions] = useState<Permissions>(initialPermissionState);

  const [permissionMap, setPermissionMap] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    console.log('Permissions updated:', permissions);
  }, [permissions]);

  useEffect(() => {
    const fetchPermissionsAndRoleData = async () => {
      try {
        // First fetch all permissions
        const permissionsResponse = await api.get('/permissions');
        console.log('All Permissions:', permissionsResponse.data);
        
        // Build permission mapping with normalized names
        const newPermissionMap = {};
        permissionsResponse.data.forEach((perm: any) => {
          const normalizedName = normalizePermissionName(perm.name);
          newPermissionMap[normalizedName] = perm.permissionId;
        });
        setPermissionMap(newPermissionMap);

        // Create new permissions object starting with initial state
        const newPermissions = { ...initialPermissionState };

        // Fetch role details
        const roleResponse = await api.get(`/roles/${roleId}`);
        if (roleResponse.data.status === 'success') {
          setFormData({
            roleName: roleResponse.data.data.role,
            description: roleResponse.data.data.description,
          });
        }

        // Fetch role permissions
        const rolePermissionsResponse = await api.get(`/role-permissions/${roleId}`);
        console.log('Role Permissions:', rolePermissionsResponse.data);

        if (rolePermissionsResponse.data.status === 'success') {
          // Mark assigned permissions as true
          rolePermissionsResponse.data.data.forEach((assignedPerm: any) => {
            const matchingPerm = permissionsResponse.data.find(
              (p: any) => p.permissionId === assignedPerm.permissionId
            );
            if (matchingPerm) {
              const normalizedName = normalizePermissionName(matchingPerm.name);
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

          console.log('Setting permissions to:', newPermissions);
          setPermissions(newPermissions);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch data');
        navigate('/roles');
      }
    };

    if (roleId) {
      fetchPermissionsAndRoleData();
    }
  }, [roleId, navigate]);

  const handleUpdateRole = async () => {
    try {
      const updateRoleResponse = await api.patch(`/roles/${roleId}`, {
        role: formData.roleName,
        description: formData.description,
      });

      if (updateRoleResponse.data.status !== 'success') {
        throw new Error(updateRoleResponse.data.message);
      }

      // Convert permission names to UUIDs using the mapping
      const selectedPermissionIds = Object.entries(permissions)
        .filter(([key, isSelected]) => {
          return isSelected && 
                 key !== 'userManagement' && 
                 key !== 'formManagement' && 
                 permissionMap[key]; // Check if it's a valid permission name
        })
        .map(([key]) => permissionMap[key]); // Map to UUID

      const updatePermissionsResponse = await api.patch(`/role-permissions/${roleId}`, {
        permissionIds: selectedPermissionIds,
      });

      if (updatePermissionsResponse.data.status !== 'success') {
        throw new Error(updatePermissionsResponse.data.message);
      }

      toast.success('Role updated successfully!');
      navigate('/roles');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handlePermissionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setPermissions(prevPermissions => {
      const newPermissions = { ...prevPermissions };
      newPermissions[name] = checked;

      // Update group headers based on their children's state
      if (name.startsWith('create') || name.startsWith('edit') || name.startsWith('delete')) {
        // Update User Management group header
        newPermissions.userManagement = 
          ['createUsers', 'editUsers', 'deleteUsers']
            .every(perm => perm === name ? checked : newPermissions[perm]);
      }

      if (name.startsWith('create') || name.startsWith('view') || name.startsWith('edit')) {
        // Update Form Management group header
        newPermissions.formManagement = 
          ['createForm', 'viewForm', 'editForm']
            .every(perm => perm === name ? checked : newPermissions[perm]);
      }

      return newPermissions;
    });
  };

  const handleGroupChange = (group: string, permissionsList: string[]) => {
    setPermissions(prevPermissions => {
      const newPermissions = { ...prevPermissions };
      const isGroupChecked = !prevPermissions[group];

      // Update all permissions in the group
      permissionsList.forEach(permission => {
        newPermissions[permission] = isGroupChecked;
      });
      newPermissions[group] = isGroupChecked;

      return newPermissions;
    });
  };

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      {/* Top Navigation Section */}
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Edit a Role
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Edit a Role</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          Assign permission easily for roles here.
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" sx={{ marginTop: '20px', marginBottom: '-5px', marginLeft: '150px' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginRight: '16px', fontSize: '18px' }}>
          {formData.roleName}
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '25px',
            paddingX: '20px',
            paddingY: '4px',
            fontSize: '14px',
            textTransform: 'none',
            marginLeft: '850px',
          }}
          onClick={handleUpdateRole}
        >
          Update
        </Button>
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ marginLeft: '150px', marginBottom: '20px', fontSize: '13px' }}>
        {formData.description}
      </Typography>

      {/* User Management Group */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px" marginTop="20px">
        <Typography variant="subtitle1" fontWeight="bold">User Management</Typography>
        <Checkbox
          checked={permissions.usermanagement}
          onChange={() =>
            handleGroupChange('userManagement', ['createUsers', 'editUsers', 'deleteUsers'])
          }
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Create Users</Typography>
        <Checkbox
          checked={permissions.createusers}
          onChange={handlePermissionChange}
          name="createUsers"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Edit Users </Typography>
        <Checkbox
          checked={permissions.editusers}
          onChange={handlePermissionChange}
          name="editUsers"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Delete Users</Typography>
        <Checkbox
          checked={permissions.deleteusers}
          onChange={handlePermissionChange}
          name="deleteUsers"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider sx={{ marginY: '16px' }} />

      {/* Form Management Group */}
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px">
        <Typography variant="subtitle1" fontWeight="bold">Form Management</Typography>
        <Checkbox
          checked={permissions.formmanagement}
          onChange={() =>
            handleGroupChange('formManagement', ['createForm', 'viewForm', 'editForm'])
          }
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Create Form</Typography>
        <Checkbox
          checked={permissions.createform}
          onChange={handlePermissionChange}
          name="createForm"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>View Form</Typography>
        <Checkbox
          checked={permissions.viewform}
          onChange={handlePermissionChange}
          name="viewForm"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Edit Form</Typography>
        <Checkbox
          checked={permissions.editform}
          onChange={handlePermissionChange}
          name="editForm"
          sx={{ color: 'black' }}
        />
      </Box>
    </Paper>
  );
}

export default EditRole;
