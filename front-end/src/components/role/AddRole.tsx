import React, { useState } from 'react';
import {
  Paper, Typography, Box, Checkbox, Divider, IconButton, TextField, Button, Grid
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';

function AddRole() {
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
  });

  const [permissions, setPermissions] = useState({
    userManagement: false,
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    formManagement: false,
    createForm: false,
    viewForm: false,
    editForm: false,
  });

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const handleGroupChange = (group, permissionsList) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = { ...prevPermissions };
      const isGroupChecked = !prevPermissions[group];
      permissionsList.forEach((permission) => {
        updatedPermissions[permission] = isGroupChecked;
      });
      updatedPermissions[group] = isGroupChecked;
      return updatedPermissions;
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      {/* Top Navigation Section */}
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Atlas corp.
          </Typography>
          <ArrowForward style={{ color: 'black' }} />
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
                padding: '-100px -100px', // Smaller padding
                paddingY: '3px', // Small padding to reduce height
          paddingX: '6px', // Adjust horizontal padding as needed
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
                padding: '-10px -10px', // Consistent smaller padding
                paddingY: '3px', // Small padding to reduce height
          paddingX: '6px', // Adjust horizontal padding as needed
          height: '30px'
                
              }
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={2} display="flex" alignItems="center">
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
          checked={permissions.userManagement}
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
          checked={permissions.createUsers}
          onChange={handlePermissionChange}
          name="createUsers"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Edit Users</Typography>
        <Checkbox
          checked={permissions.editUsers}
          onChange={handlePermissionChange}
          name="editUsers"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Delete Users</Typography>
        <Checkbox
          checked={permissions.deleteUsers}
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
          checked={permissions.formManagement}
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
          checked={permissions.createForm}
          onChange={handlePermissionChange}
          name="createForm"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>View Form</Typography>
        <Checkbox
          checked={permissions.viewForm}
          onChange={handlePermissionChange}
          name="viewForm"
          sx={{ color: 'black' }}
        />
      </Box>
      <Divider />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography>Edit Form</Typography>
        <Checkbox
          checked={permissions.editForm}
          onChange={handlePermissionChange}
          name="editForm"
          sx={{ color: 'black' }}
        />
      </Box>
    </Paper>
  );
}

export default AddRole;