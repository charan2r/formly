import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Checkbox, Divider, IconButton, TextField, Button, Grid
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/axios';
import { toast } from 'react-toastify';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../../context/AuthContext';
interface Permissions {
  // Group headers
  userManagement: boolean;
  templateManagement: boolean;
  categoryManagement: boolean;
  roleManagement: boolean;
  formManagement: boolean;
  // Individual permissions will be added dynamically
  [key: string]: boolean;
}

// Define initial permission state with all values explicitly set
const initialPermissionState: Permissions = {
  // Group headers
  usermanagement: false,
  templatemanagement: false,
  categorymanagement: false,
  rolemanagement: false,
  formmanagement: false,
  // User permissions
  createuser: false,
  viewuser: false,
  edituser: false,
  deleteuser: false,
  // Template permissions
  createtemplate: false,
  viewtemplate: false,
  edittemplate: false,
  deletetemplate: false,
  // Category permissions
  createcategory: false,
  viewcategory: false,
  editcategory: false,
  deletecategory: false,
  // Role permissions
  createrole: false,
  viewrole: false,
  editrole: false,
  deleterole: false,
  // Form permissions
  createform: false,
  viewform: false,
  editform: false,
  deleteform: false,
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
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
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
            ['createUser', 'viewUser', 'editUser', 'deleteUser']
              .every(perm => newPermissions[perm]);

          newPermissions.templateManagement = 
            ['createTemplate', 'viewTemplate', 'editTemplate', 'deleteTemplate']
              .every(perm => newPermissions[perm]);

          newPermissions.categoryManagement = 
            ['createCategory', 'viewCategory', 'editCategory', 'deleteCategory']
              .every(perm => newPermissions[perm]);

          newPermissions.roleManagement = 
            ['createRole', 'viewRole', 'editRole', 'deleteRole']
              .every(perm => newPermissions[perm]);

          newPermissions.formManagement = 
            ['createForm', 'viewForm', 'editForm', 'deleteForm']
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
                 key !== 'templateManagement' && 
                 key !== 'categoryManagement' && 
                 key !== 'roleManagement' && 
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
          ['createUser', 'viewUser', 'editUser', 'deleteUser']
            .every(perm => perm === name ? checked : newPermissions[perm]);
      }

      if (name.startsWith('create') || name.startsWith('view') || name.startsWith('edit')) {
        // Update Template Management group header
        newPermissions.templateManagement = 
          ['createTemplate', 'viewTemplate', 'editTemplate', 'deleteTemplate']
            .every(perm => perm === name ? checked : newPermissions[perm]);
      }

      if (name.startsWith('create') || name.startsWith('view') || name.startsWith('edit')) {
        // Update Category Management group header
        newPermissions.categoryManagement = 
          ['createCategory', 'viewCategory', 'editCategory', 'deleteCategory']
            .every(perm => perm === name ? checked : newPermissions[perm]);
      }

      if (name.startsWith('create') || name.startsWith('edit') || name.startsWith('delete')) {
        // Update Role Management group header
        newPermissions.roleManagement = 
          ['createRole', 'viewRole', 'editRole', 'deleteRole']
            .every(perm => perm === name ? checked : newPermissions[perm]);
      }

      if (name.startsWith('create') || name.startsWith('view') || name.startsWith('edit')) {
        // Update Form Management group header
        newPermissions.formManagement = 
          ['createForm', 'viewForm', 'editForm', 'deleteForm']
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
          Edit a Role
        </Typography>
      </Box>
        <Typography variant="h5" fontWeight="bold">Edit a Role</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="20px" marginTop="-10px">
          Edit role and assign permissions.
        </Typography>
      </Box>

      {/* Input Fields and Update Button */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={5} display="flex" alignItems="center">
          <Typography variant="body2" sx={{ marginRight: '8px', marginLeft: '25px', minWidth: '70px', color: 'black' }}>
            Role Name
          </Typography>
          <TextField
            name="roleName"
            value={formData.roleName}
            onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            onClick={handleUpdateRole}
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
            Update
          </Button>
        </Grid>
      </Grid>

      {/* Permission Groups */}
      {[
        { title: 'User Management', key: 'userManagement' },
        { title: 'Form Management', key: 'formManagement' },
        { title: 'Template Management', key: 'templateManagement' },
        { title: 'Category Management', key: 'categoryManagement' },
        { title: 'Role Management', key: 'roleManagement' }
      ].map(({ title, key }) => (
        <React.Fragment key={key}>
          <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px" marginTop="20px">
            <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
            <Checkbox
              checked={permissions[key]}
              onChange={() => handleGroupChange(key, [
                `create${key.replace('Management', '')}`,
                `view${key.replace('Management', '')}`,
                `edit${key.replace('Management', '')}`,
                `delete${key.replace('Management', '')}`
              ])}
              sx={{ color: 'black' }}
            />
          </Box>
          <Divider />
          {['Create', 'View', 'Edit', 'Delete'].map((action) => (
            <React.Fragment key={`${action}${key}`}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography>{`${action} ${key.replace('Management', '')}`}</Typography>
                <Checkbox
                  checked={permissions[`${action.toLowerCase()}${key.replace('Management', '')}`]}
                  onChange={handlePermissionChange}
                  name={`${action.toLowerCase()}${key.replace('Management', '')}`}
                  sx={{ color: 'black' }}
                />
              </Box>
              <Divider />
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </Paper>
  );
}

export default EditRole;
