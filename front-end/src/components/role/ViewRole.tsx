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

interface Permission {
  permissionId: string;
  name: string;
  status: string;
}

interface PermissionGroups {
  userManagement: Permission[];
  formManagement: Permission[];
  templateManagement: Permission[];
  categoryManagement: Permission[];
  roleManagement: Permission[];
}

function ViewRole() {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
  });
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: boolean }>({});
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroups>({
    userManagement: [],
    formManagement: [],
    templateManagement: [],
    categoryManagement: [],
    roleManagement: []
  });

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
        const permissions = permissionsResponse.data;
        
        // Group permissions based on their names
        const grouped = permissions.reduce((acc: PermissionGroups, permission: Permission) => {
          const name = permission.name.toLowerCase();
          if (name.includes('user')) {
            acc.userManagement.push(permission);
          } else if (name.includes('form')) {
            acc.formManagement.push(permission);
          } else if (name.includes('template')) {
            acc.templateManagement.push(permission);
          } else if (name.includes('category')) {
            acc.categoryManagement.push(permission);
          } else if (name.includes('role')) {
            acc.roleManagement.push(permission);
          }
          return acc;
        }, {
          userManagement: [],
          formManagement: [],
          templateManagement: [],
          categoryManagement: [],
          roleManagement: []
        });

        setPermissionGroups(grouped);

        // Fetch role permissions
        const rolePermissionsResponse = await api.get(`/role-permissions/${roleId}`);
        if (rolePermissionsResponse.data.status === 'success') {
          const permissionState = rolePermissionsResponse.data.data.reduce(
            (acc: { [key: string]: boolean }, { permissionId }: { permissionId: string }) => ({
              ...acc,
              [permissionId]: true
            }),
            {}
          );
          setSelectedPermissions(permissionState);
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

      {/* Permission Groups */}
      {[
        { title: 'User Management', key: 'userManagement' },
        { title: 'Form Management', key: 'formManagement' },
        { title: 'Template Management', key: 'templateManagement' },
        { title: 'Category Management', key: 'categoryManagement' },
        { title: 'Role Management', key: 'roleManagement' }
      ].map(({ title, key }) => (
        <React.Fragment key={key}>
          {permissionGroups[key as keyof PermissionGroups].length > 0 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="8px" marginTop="20px">
                <Typography variant="subtitle1" fontWeight="bold">{title}</Typography>
                <Checkbox
                  checked={permissionGroups[key as keyof PermissionGroups]
                    .every(p => selectedPermissions[p.permissionId])}
                  disabled
                  sx={{ color: 'black' }}
                />
              </Box>
              <Divider />
              {permissionGroups[key as keyof PermissionGroups].map(permission => (
                <React.Fragment key={permission.permissionId}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography>{permission.name}</Typography>
                    <Checkbox
                      checked={selectedPermissions[permission.permissionId] || false}
                      disabled
                      sx={{ color: 'black' }}
                    />
                  </Box>
                  <Divider />
                </React.Fragment>
              ))}
            </>
          )}
        </React.Fragment>
      ))}
    </Paper>
  );
}

export default ViewRole;
