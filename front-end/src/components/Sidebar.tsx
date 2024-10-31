import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Stack, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';
import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

const Sidebar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        borderRight: '1px solid #E0E0E0',
      }}
    >
      {/* Logo and Title */}
      <Stack direction="row" alignItems="center" spacing={1} mb={6} mt={2} ml={2}>
        <img
          src="logo.png" 
          alt="Logo"
          style={{ maxWidth: '30px', maxHeight: '30px' }}
        />
        <Typography variant="h5" fontWeight="bold">
          Form.M
        </Typography>
      </Stack>

      {/* Menu Items */}
      <Box ml={2}>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mb: 1, mt: 2 }} 
        >
          GENERAL
        </Typography>
        <List disablePadding sx={{ marginLeft: '-14px' }}>
          <ListItemButton component={Link} to="/overview">
            <ListItemText 
              primary="Overview" 
              primaryTypographyProps={{ fontWeight: 'bold' }} 
            />
          </ListItemButton>
          <ListItemButton component={Link} to="/organizations">
            <ListItemText 
              primary="Organizations" 
              primaryTypographyProps={{ fontWeight: 'bold' }} 
            />
          </ListItemButton>
          <ListItemButton component={Link} to="/audit-logs">
            <ListItemText 
              primary="Audit Logs" 
              primaryTypographyProps={{ fontWeight: 'bold' }} 
            />
          </ListItemButton>
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
            padding: '4px 8px',
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
          <Box
            sx={{
              position: 'relative',
              width: 30,
              height: 30,
              borderRadius: '50%',
            }}
          >
            <Avatar
              src="/path/to/avatar.jpg"
              alt="Sardor"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '2px solid white',
              }}
            />
          </Box>
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
              width: '180px',
              backgroundColor: 'white',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #E0E0E0',
              zIndex: 10,
              padding: '4px 0', // Small padding for a compact look
            }}
          >
            <List dense> {/* Makes items compact */}
              <ListItemButton>
                <SettingsOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Profile Settings" primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
              <ListItemButton>
                <HelpOutlineOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Help Center" primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
              <ListItemButton>
                <DescriptionOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Terms and Conditions" primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
              <ListItemButton>
                <ExitToAppOutlinedIcon fontSize="small" sx={{ mr: 1, color: 'gray' }} />
                <ListItemText primary="Sign Out" primaryTypographyProps={{ fontSize: '0.875rem' }} />
              </ListItemButton>
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
