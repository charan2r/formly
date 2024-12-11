import React, { useState, useEffect } from 'react';
import { Paper, TextField, Button, Typography, Grid, Box, IconButton, InputAdornment, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function EditOrganization() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    category: '', 
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    website: '',
    firstName: '',
    lastName: '',
    adminPhone: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/organization/details', {
          params: { id: orgId }
        });

        console.log('API Response:', response.data);

        if (response.data.status === 'success') {
          const { organization, superAdmin } = response.data.data;
          console.log('SuperAdmin Data:', superAdmin);
          
          setFormData({
            name: organization.name || '',
            category: organization.category || '',
            phone: organization.phone || '',
            street: organization.street || '',
            city: organization.city || '',
            state: organization.state || '',
            zip: organization.zip || '',
            website: organization.website || '',
            firstName: superAdmin?.firstName || '',
            lastName: superAdmin?.lastName || '',
            adminPhone: superAdmin?.phone || '',
            email: superAdmin?.email || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        const errorMessage = error.response?.data?.message || "Failed to load organization details.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationDetails();
  }, [orgId, isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const { firstName, lastName, adminPhone, email, ...organizationData } = formData;

    try {
      const response = await api.patch('/organization/edit', organizationData, {
        params: { id: orgId },
      });

      if (response.data.status === 'success') {
        toast.success("Your changes have been saved successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
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

        const updatedOrg = response.data.data;
        setFormData(prevData => ({
          ...prevData,
          name: updatedOrg.name,
          category: updatedOrg.category,
          phone: updatedOrg.phone,
          street: updatedOrg.street,
          city: updatedOrg.city,
          state: updatedOrg.state,
          zip: updatedOrg.zip,
          website: updatedOrg.website,
        }));

        setTimeout(() => {
          navigate(`/view-organization/${orgId}`);
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to save changes. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
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
    }
  };

  const handleBack = () => {
    navigate('/organizations');
  };

  return (
    <Paper elevation={4} sx={{ 
      padding: { xs: '16px', sm: '24px', md: '36px' },
      margin: '16px',
      width: '100%',
      borderRadius: 3,
      overflow: 'hidden'
    }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={2}>
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
            <ArrowBackIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <CircleIcon sx={{ fontSize: 22, color: 'black' }} />
          <ChevronRightIcon sx={{ fontSize: 22, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Organization Management
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '38px' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">Edit Organization</Typography>
            <Typography variant="body2" color="textSecondary">
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
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Organizational Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom sx={{ marginBottom: '1px' }}>Organization Name *</Typography>
            <TextField
              name="name"
              value={formData.name}
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
                sx: { backgroundColor: '#f9f9f9', width: '70%', borderRadius: '5px', paddingY: '2px', height: '30px' }
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

        <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '24px', fontWeight: 'bold'}} >
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
              value={formData.adminPhone || ''}
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

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Paper>
  );
}

export default EditOrganization;
