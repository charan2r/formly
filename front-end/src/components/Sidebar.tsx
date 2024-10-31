import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Stack, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { HiOutlineCog, HiOutlineQuestionMarkCircle, HiOutlineDocumentText, HiOutlineLogout, HiChevronUp, HiChevronDown } from 'react-icons/hi';

const Sidebar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleProfileClick = () => {
    setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
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
            justifyContent: 'space-between', // Space between avatar and icon
            cursor: 'pointer',
            borderRadius: '8px', // Adjusted for a smaller button
            padding: '4px 8px', // Adjusted padding for a smaller button
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
          {/* Avatar with Stroke */}
          <Box
            sx={{
              position: 'relative',
              width: 30, // Adjusted width for a smaller button
              height: 30, // Adjusted height for a smaller button
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
                border: '2px solid white', // Inner border
              }}
            />
          </Box>
          <Typography fontWeight="bold" sx={{ ml: 1, fontSize: '0.75rem', color: '#333' }}>
            Sardor
          </Typography>
          {/* Drop-Up Icon */}
          {isDropdownOpen ? (
            <HiChevronUp size={20} style={{ color: '#333', marginLeft: 'auto' }} />
          ) : (
            <HiChevronDown size={20} style={{ color: '#333', marginLeft: 'auto' }} />
          )}
        </Box>

        {/* Drop-Up Menu */}
        {isDropdownOpen && (
          <Box
            sx={{
              position: 'absolute',
              bottom: '100%', // Position above the profile section
              left: 0,
              mb: 1,
              width: '180px', // Adjusted for better fit
              backgroundColor: 'white',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #E0E0E0',
              zIndex: 10,
            }}
          >
            <List>
              <ListItemButton>
                <HiOutlineCog className="mr-2 text-gray-600" />
                <ListItemText primary="Profile Settings" />
              </ListItemButton>
              <ListItemButton>
                <HiOutlineQuestionMarkCircle className="mr-2 text-gray-600" />
                <ListItemText primary="Help Center" />
              </ListItemButton>
              <ListItemButton>
                <HiOutlineDocumentText className="mr-2 text-gray-600" />
                <ListItemText primary="Terms and Conditions" />
              </ListItemButton>
              <ListItemButton>
                <HiOutlineLogout className="mr-2 text-gray-600" />
                <ListItemText primary="Sign Out" />
              </ListItemButton>
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Sidebar;
