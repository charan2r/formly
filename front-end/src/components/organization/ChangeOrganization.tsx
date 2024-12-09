import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
import { Paper, TextField, Button, Typography, Grid, Box, IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function ChangeOrganization() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'phone', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields', {
        style: {
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold',
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.patch('/organization/change-admin', formData, {
        params: { orgId }
      });

      if (response.data.status === 'success') {
        toast.success("Admin changed successfully!", {
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

        // Navigate after success
        setTimeout(() => {
          navigate(`/view-organization/${orgId}`);
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to change admin. Please try again.";
      toast.error(errorMessage, {
        style: {
          backgroundColor: 'black',
          color: 'white',
          borderRadius: '10px',
          fontWeight: 'bold',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/view-organization/${orgId}`);
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
            onClick={handleBack}
          >
            <KeyboardBackspaceRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <CircleIcon sx={{ fontSize: 22, color: 'black' }} />
          <ChevronRightIcon sx={{ fontSize: 22, color: 'black' }} />
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
            sx={{ 
              backgroundColor: 'black',
              color: 'white',
              borderRadius: '20px',
              paddingX: '30px'
            }}
            onClick={handleUpdate}
            disabled={isLoading}
          >
            {isLoading ? 'Changing...' : 'Change'}
          </Button>
        </Box>
      </Box>

      <form>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '-4px' }}>
          New Admin Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom>Admin's First Name *</Typography>
            <TextField
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter First Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom>Admin's Last Name *</Typography>
            <TextField
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              required
              placeholder="Enter Last Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom>New Phone</Typography>
            <TextField
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              placeholder="Enter New Phone"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px' }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" gutterBottom>New Email</Typography>
            <TextField
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              placeholder="Enter New Email"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
              }}
              sx={{ paddingY: '2px' }}
            />
          </Grid>
        </Grid>
      </form>

      <ToastContainer />
    </Paper>
  );
}

export default ChangeOrganization;
