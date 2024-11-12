import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Grid, Box, IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ChangeOrganization() {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    firstName: 'John',
    lastName: 'Doe',
    newphone: '',
    newEmail: '',
    phone: '0702433548',
    email: 'admin@email.com'
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = () => {
    // Update Super Admin Details based on new Organizational Details
    setFormData({
      ...formData,
      firstName: formData.name || formData.firstName, // Update firstName if name is provided
      lastName: formData.category || formData.lastName, // Update lastName if category is provided
      phone: formData.newphone || formData.phone, // Update phone if newphone is provided
      email: formData.newEmail || formData.email, // Update email if newEmail is provided
    });

    toast.success("Changed successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      style: {
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '10px',
        fontWeight: 'bold',
      },
    });
  };

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Organization Management
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">Change Admin</Typography>
            <Typography variant="body2" color="textSecondary" marginBottom="20px">
              Change and Manage Admin Details.
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', paddingX: '30px' }}
            onClick={handleUpdate}
          >
            Change
          </Button>
        </Box>
      </Box>

      <form>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '-4px' }}>
          New Admin Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>New Admin's First Name *</Typography>
            <TextField
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter First Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>New Admin's Last Name *</Typography>
            <TextField
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter Last Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>New Phone</Typography>
            <TextField
              name="newphone"
              value={formData.newphone}
              onChange={handleChange}
              fullWidth
              placeholder="Enter New Phone"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>New Email</Typography>
            <TextField
              name="newEmail"
              value={formData.newEmail}
              onChange={handleChange}
              fullWidth
              placeholder="Enter New Email"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '24px', marginBottom: '-4px', fontWeight: 'bold'}}>
          Current Super Admin Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>First Name *</Typography>
            <TextField
              name="firstName"
              value={formData.firstName}
              fullWidth
              placeholder="Enter First Name"
              disabled
              InputProps={{
                sx: { backgroundColor: '#f1f1f1', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Last Name *</Typography>
            <TextField
              name="lastName"
              value={formData.lastName}
              fullWidth
              placeholder="Enter Last Name"
              disabled
              InputProps={{
                sx: { backgroundColor: '#f1f1f1', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Phone</Typography>
            <TextField
              name="phone"
              value={formData.phone}
              fullWidth
              placeholder="0702433548"
              disabled
              InputProps={{
                sx: { backgroundColor: '#f1f1f1', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Email</Typography>
            <TextField
              name="email"
              value={formData.email}
              fullWidth
              placeholder="admin@email.com"
              disabled
              InputProps={{
                sx: { backgroundColor: '#f1f1f1', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
        </Grid>
      </form>

      <ToastContainer />
    </Paper>
  );
}

export default ChangeOrganization;
