import React from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '250px' },
        backgroundColor: '#F9F9F9',
        color: '#333',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        boxSizing: 'border-box',
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
        <List disablePadding sx={{marginLeft:'-14px'}} >
          <ListItemButton component={Link} to="/overview">
            <ListItemText 
              primary="Overview" 
              primaryTypographyProps={{ fontWeight: 'bold' }} 
            />
          </ListItemButton>
          <ListItemButton component={Link} to="/">
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
    </Box>
  );
};

export default Sidebar;
