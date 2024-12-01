import React, { useState } from 'react';
import {
  Paper, Typography, Box, Checkbox, Divider, IconButton, TextField, Button, Grid
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';

function EditRole() {
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
    Role ABC
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
  >
    Update
  </Button>
</Box>
<Typography variant="body2" color="textSecondary" sx={{ marginLeft: '150px', marginBottom: '20px', fontSize: '13px' }}>
  Role description will be written here
</Typography>


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

export default EditRole;
