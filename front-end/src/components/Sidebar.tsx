import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Stack, Avatar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const Sidebar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // Get the current location

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev);
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
        height: '100vh',
        boxSizing: 'border-box',
      }}
    >
      {/* Logo and Title */}
      <Stack direction="row" alignItems="center" spacing={1} mb={6} mt={2} ml={2}>
        <HighlightOffIcon fontSize='large' />
        <Typography variant="h5" fontWeight="bold">
          Form.M
        </Typography>
      </Stack>

      {/* Menu Items */}
      <Box ml={2}>
  <Typography 
    variant="caption" 
    color="text.secondary" 
  >
    GENERAL
  </Typography>
  <List disablePadding sx={{ marginLeft: '-14px', marginTop: '7px'}}>
    {['/overview', '/organizations', '/audit-logs'].map((path) => (
      <ListItemButton
        key={path}
        component={Link}
        to={path}
        sx={{
          borderRadius: '150px',
          padding: '1px',
          margin: '5px',
          backgroundColor: location.pathname === path ? 'black' : 'transparent', // Change background based on active path
          color: location.pathname === path ? 'white' : 'inherit', // Change text color based on active path
          '&:hover': {
            backgroundColor: location.pathname === path ? 'black' : '#E0E0E0', // Hover effect
          },
        }}
      >
        <ListItemText 
          primary={
            path === '/overview' ? 'Overview' :
            path === '/organizations' ? 'Organizations' : 
            'Audit Logs'
          } 
          primaryTypographyProps={{ fontWeight: 'bold', marginLeft: '15px' }} 
        />
      </ListItemButton>
    ))}
  </List>
</Box>


      {/* Profile Dropdown */}
      <Box mt="auto" mb={2} ml={2} sx={{ position: 'relative' }}>
      <Box
  onClick={handleProfileClick}
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    borderRadius: '8px',
    padding: '4px 16px', // Adjusted padding to reduce height and increase width
    width: '100%', // Set a specific width to increase the button width
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
          {/* Avatar */}
          <Avatar
            src="/path/to/avatar.jpg"
            alt="Sardor"
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '1px solid white',
            }}
          />
          <Typography fontWeight="bold" sx={{ ml: 1, fontSize: '0.75rem', color: '#333' }}>
            Sardor
          </Typography>
          {isDropdownOpen ? (
            <KeyboardArrowUpOutlinedIcon style={{ color: '#333', marginLeft: 'auto' }} />
          ) : (
            <KeyboardArrowDownOutlinedIcon style={{ color: '#333', marginLeft: 'auto' }} />
          )}
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
              padding: '4px 0',
            }}
          >
            {/* Profile Info (Avatar, Name, Email) */}
            <Stack direction="row" alignItems="center" spacing={1} p={1}>
              <Avatar src="/path/to/avatar.jpg" alt="Sardor" sx={{ width: 30, height: 30 }} />
              <Box textAlign="left">
                <Typography fontSize="0.75rem" fontWeight="bold">
                  Sardor
                </Typography>
                <Typography fontSize="0.7rem" color="gray">
                  sardor@gmail.com
                </Typography>
              </Box>
            </Stack>

            {/* Divider Line */}
            <Box sx={{ borderBottom: '1px solid #E0E0E0', mb: 0.5 }} />

            <List dense sx={{ py: 0 }}>
              <ListItemButton sx={{ py: 0.5 }}>
                <SettingsOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Profile Settings" primaryTypographyProps={{ fontSize: '0.75rem' }} />
              </ListItemButton>
              <ListItemButton sx={{ py: 0.5 }}>
                <HelpOutlineOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Help Center" primaryTypographyProps={{ fontSize: '0.75rem' }} />
              </ListItemButton>
              <ListItemButton sx={{ py: 0.5 }}>
                <DescriptionOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Terms" primaryTypographyProps={{ fontSize: '0.75rem' }} />
              </ListItemButton>

              {/* Divider Line Above Sign Out */}
              <Box sx={{ borderBottom: '1px solid #E0E0E0', mb: 0.5, mt: 0.5 }} />

              <ListItemButton sx={{ py: 0.5 }}>
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
