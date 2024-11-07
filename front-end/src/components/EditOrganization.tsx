import React, { useState } from 'react';
import { Paper, TextField, Button, Typography, Grid, Box, IconButton, InputAdornment, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify

function EditOrganization() {
  const [formData, setFormData] = useState({
    orgName: 'Tech Solutions',
    category: 'IT Services', 
    phone: '123-456-7890',
    street: '123 Main St',
    city: 'Metropolis',
    state: 'CA',
    zip: '90001',
    website: 'www.techsolutions.com',
    firstName: 'John',
    lastName: 'Doe',
    adminPhone: '987-654-3210',
    email: 'john.doe@techsolutions.com',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Log the updated form data to the console
    console.log('Form submitted', formData);

    // Display toast message on successful update with custom styling
    toast.success("Your changes have been saved successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
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
            <Typography variant="h5" fontWeight="bold">Edit Organization</Typography>
            <Typography variant="body2" color="textSecondary" marginBottom="20px">
              Modify and Manage your organizations.
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', paddingX: '30px' }}
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '-4px' }}>
          Organizational Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Organization Name *</Typography>
            <TextField
              name="orgName"
              value={formData.orgName}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter Organization's Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px' ,width: '70%',  paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }} 
            />
          </Grid>

          {/* Text input for Category instead of dropdown */}
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Category *</Typography>
            <TextField
              name="category"
              value={formData.category}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter Category"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>Phone *</Typography>
            <TextField
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter Organization Phone No"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>Street</Typography>
            <TextField
              name="street"
              value={formData.street}
              onChange={handleChange}
              fullWidth
              placeholder="Enter Street"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>City</Typography>
            <TextField
              name="city"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              placeholder="City"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>State</Typography>
            <TextField
              name="state"
              value={formData.state}
              onChange={handleChange}
              fullWidth
              placeholder="Enter State"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>Zip</Typography>
            <TextField
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              fullWidth
              placeholder="ZipCode"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', width: '70%', width: '70%', borderRadius: '5px', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>Website *</Typography>
            <TextField
              name="website"
              value={formData.website}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Website"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '24px', marginBottom: '-4px', fontWeight: 'bold'}} >
          Super Admin Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>First Name *</Typography>
            <TextField
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              disabled
              required
              placeholder="Enter First Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Last Name *</Typography>
            <TextField
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              disabled
              required
              placeholder="Enter Last Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>Phone *</Typography>
            <TextField
              name="adminPhone"
              value={formData.adminPhone}
              onChange={handleChange}
              fullWidth
              disabled
              required
              placeholder="Enter Phone No"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px', marginTop: '-2px' }}>Email *</Typography>
            <TextField
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              disabled
              placeholder="Enter Email"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px', marginBottom: '-8px' }}
            />
          </Grid>
        </Grid>
      </form>

      {/* ToastContainer component to display toast messages */}
      <ToastContainer />
    </Paper>
  );
}

export default EditOrganization;
