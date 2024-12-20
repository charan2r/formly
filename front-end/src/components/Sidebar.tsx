import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Stack, Avatar } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useAuth } from '../context/AuthContext';

type Permission = string | string[];

interface MenuItem {
  path: string;
  label: string;
  permission: Permission;
}

const Sidebar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Helper function to check permissions
  const hasPermission = (permission: Permission) => {
    if (!user?.permissions) return false;
    if (!permission) return true;
    
    // If permission is an array, check if user has any of the permissions
    if (Array.isArray(permission)) {
      return permission.some(perm => user.permissions.includes(perm));
    }
    
    // Single permission check
    return user.permissions.includes(permission);
  };

  // Get menu items based on user type
  const getMenuItems = () => {
    if (user?.userType === 'SuperAdmin') {
      return {
        general: [
          { path: '/overview', label: 'Overview', permission: null },
          { path: '/organizations', label: 'Organizations', permission: null },
          { path: '/audit-trail', label: 'Audit Trails', permission: null },
        ],
        authorization: [] // SuperAdmin doesn't need authorization section
      };
    }

    // For Admin and SubUser
    return {
      general: [
        { path: '/userOverview', label: 'Overview', permission: null },
        { 
          path: '/forms', 
          label: 'Forms', 
          permission: ['View Form', 'Edit Form', 'Delete Form', 'Create Form']
        },
        { 
          path: '/templates', 
          label: 'Templates', 
          permission: ['View Template', 'Edit Template', 'Delete Template', 'Create Template']
        },
        { 
          path: '/categories', 
          label: 'Categories', 
          permission: ['View Category', 'Edit Category', 'Delete Category', 'Create Category']
        },
      ],
      authorization: [
        { 
          path: '/users', 
          label: 'Users', 
          permission: ['View User', 'Edit User', 'Delete User', 'Create User']
        },
        { 
          path: '/roles', 
          label: 'Roles', 
          permission: ['View Role', 'Edit Role', 'Delete Role', 'Create Role']
        }
      ]
    };
  };

  const menuItems = getMenuItems();

  // Filter menu items based on permissions for non-SuperAdmin users
  const filteredGeneralMenuItems = menuItems.general.filter(item => {
    if (user?.userType === 'SuperAdmin') return true;
    if (user?.userType === 'Admin') return true;
    return hasPermission(item.permission);
  });

  const filteredAuthorizationMenuItems = menuItems.authorization.filter(item => {
    if (user?.userType === 'SuperAdmin') return true;
    if (user?.userType === 'Admin') return true; // Admin sees all authorization items
    return hasPermission(item.permission); // SubUser needs permission check
  });

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileSettings = () => {
    if (location.pathname !== '/profile-settings') {
      navigate('/profile-settings');
    }
    setIsDropdownOpen(false);
  };

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '250px' },
        backgroundColor: '#F9F9F9',
        color: '#333',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        height: '100%',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        left: 0,
      }}
    >
      {/* Logo and Title */}
      <Stack direction="row" alignItems="center" spacing={1} mb={6} mt={2} ml={2}>
        <HighlightOffIcon fontSize='large' />
        <Typography variant="h5" fontWeight="bold">
          Form.M
        </Typography>
      </Stack>

      {/* GENERAL Menu Items */}
      {filteredGeneralMenuItems.length > 0 && (
        <Box ml={2}>
          <Typography variant="caption" color="text.secondary">
            GENERAL
          </Typography>
          <List disablePadding sx={{ marginLeft: '-14px', marginTop: '7px'}}>
            {filteredGeneralMenuItems.map(({ path, label }) => (
              <ListItemButton
                key={path}
                component={Link}
                to={path}
                sx={{
                  borderRadius: '150px',
                  padding: '1px',
                  margin: '5px',
                  backgroundColor: location.pathname === path ? 'black' : 'transparent',
                  color: location.pathname === path ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: location.pathname === path ? 'black' : '#E0E0E0',
                  },
                }}
              >
                <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 'bold', marginLeft: '15px' }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}

      {/* AUTHORIZATION Menu Items */}
      {filteredAuthorizationMenuItems.length > 0 && (
        <Box ml={2} mt={3}>
          <Typography variant="caption" color="text.secondary">
            AUTHORIZATION
          </Typography>
          <List disablePadding sx={{ marginLeft: '-14px', marginTop: '7px'}}>
            {filteredAuthorizationMenuItems.map(({ path, label }) => (
              <ListItemButton
                key={path}
                component={Link}
                to={path}
                sx={{
                  borderRadius: '150px',
                  padding: '1px',
                  margin: '5px',
                  backgroundColor: location.pathname === path ? 'black' : 'transparent',
                  color: location.pathname === path ? 'white' : 'inherit',
                  '&:hover': {
                    backgroundColor: location.pathname === path ? 'black' : '#E0E0E0',
                  },
                }}
              >
                <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 'bold', marginLeft: '15px' }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      )}

      {/* Profile Dropdown */}
      <Box 
        mt="auto" 
        mb={2} 
        ml={2} 
        sx={{ 
          position: 'sticky',
          bottom: 0,
          backgroundColor: '#F9F9F9',
          paddingTop: 2,
          zIndex: 1,
        }}
      >
        <Box
          onClick={handleProfileClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            borderRadius: '8px',
            padding: '8px 20px',
            width: '100%',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
            backgroundColor: '#fff',
            border: '1px solid #E0E0E0',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Avatar 
            sx={{ 
              width: 24, 
              height: 24, 
              borderRadius: '50%', 
              border: '1px solid white',
              bgcolor: 'black'
            }}
          >
            {user?.email?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography fontWeight="bold" sx={{ ml: 1, fontSize: '0.75rem', color: '#333' }}>
            {user?.email?.split('@')[0]}
          </Typography>
          {isDropdownOpen ? 
            <KeyboardArrowUpOutlinedIcon style={{ color: '#333', marginLeft: 'auto' }} /> : 
            <KeyboardArrowDownOutlinedIcon style={{ color: '#333', marginLeft: 'auto' }} />
          }
        </Box>

        {/* Drop-Up Menu */}
        {isDropdownOpen && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '100%',
              left: 0,
              mb: 1,
              width: '160px',
              backgroundColor: 'white',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #E0E0E0',
              zIndex: 10,
              padding: '8px 0',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} p={1.5}>
              <Avatar 
                sx={{ 
                  width: 30, 
                  height: 30,
                  bgcolor: 'black'
                }}
              >
                {user?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <Box textAlign="left">
                <Typography fontSize="0.75rem" fontWeight="bold">
                  {user?.email?.split('@')[0]}
                </Typography>
                <Typography fontSize="0.5rem" color="gray">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ borderBottom: '1px solid #E0E0E0', mb: 0.5 }} />
            <List dense sx={{ py: 0.5 }}>
              <ListItemButton onClick={handleProfileSettings} sx={{ py: 0.75 }}>
                <SettingsOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Profile Settings" primaryTypographyProps={{ fontSize: '0.75rem' }} />
              </ListItemButton>
              <ListItemButton sx={{ py: 0.75 }}>
                <HelpOutlineOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Help Center" primaryTypographyProps={{ fontSize: '0.75rem' }} />
              </ListItemButton>
              <ListItemButton sx={{ py: 0.75 }}>
                <DescriptionOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Terms" primaryTypographyProps={{ fontSize: '0.75rem' }} />
              </ListItemButton>
              <Box sx={{ borderBottom: '1px solid #E0E0E0', mb: 0.5, mt: 0.5 }} />
              <ListItemButton onClick={handleLogout} sx={{ py: 0.75 }}>
                <ExitToAppOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.75rem' }} />
              </ListItemButton>
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
