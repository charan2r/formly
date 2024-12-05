import React, { useState, useEffect } from 'react';
import { Paper, TextField, Typography, Grid, Box, IconButton, Button, CircularProgress } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
import { toast, ToastContainer } from 'react-toastify';

interface OrganizationData {
  organization: {
    name: string;
    category: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    website: string;
  };
  superAdmin: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  } | null;
}

function ViewOrganization() {
  const navigate = useNavigate();
  const { orgId } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    orgName: '',
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

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const response = await api.get<{ status: string; message: string; data: OrganizationData }>(
          '/organization/details',
          {
            params: { id: orgId },
          }
        );

        if (response.data.status === 'success') {
          const { organization, superAdmin } = response.data.data;
          
          setFormData({
            orgName: organization.name,
            category: organization.category,
            phone: organization.phone,
            street: organization.street,
            city: organization.city,
            state: organization.state,
            zip: organization.zip,
            website: organization.website,
            firstName: superAdmin?.firstName || '',
            lastName: superAdmin?.lastName || '',
            adminPhone: superAdmin?.phoneNumber || '',
            email: superAdmin?.email || '',
          });
        } else {
          throw new Error(response.data.message);
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Failed to load organization details.';
        setError(errorMessage);
        toast.error(errorMessage, {
          style: {
            backgroundColor: 'black',
            color: 'white',
            borderRadius: '10px',
            fontWeight: 'bold',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationDetails();
  }, [orgId, isAuthenticated, navigate]);

  const handleBack = () => {
    navigate('/organizations');
  };

  const handleEdit = () => {
    navigate(`/edit-organization/${orgId}`);
  };

  if (loading) {
    return (
      <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#F9F9F9',
        gap: 2,
      }}
    >
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: 'black', // Matches your theme
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: '#666',
          fontWeight: 500,
          marginTop: 1,
        }}
      >
        Loading...
      </Typography>
    </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        padding: { xs: '16px', sm: '24px', md: '36px' },
        margin: '16px',
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden'
      }}
    >
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
            <KeyboardBackspaceRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <CircleIcon sx={{ fontSize: 22, color: 'black' }} />
          <ChevronRightIcon sx={{ fontSize: 22, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Organization Management
          </Typography>
        </Box>

        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', sm: 'row' }} 
          justifyContent="space-between" 
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          gap={2}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold">View Organization</Typography>
            <Typography variant="body2" color="textSecondary" marginBottom="20px">
              View your organization details.
            </Typography>
          </Box>
          {user?.userType === 'SuperAdmin' && (
            <Button
              variant="contained"
              sx={{ 
                backgroundColor: 'black', 
                color: 'white', 
                borderRadius: '20px', 
                paddingX: '30px' 
              }}
              onClick={handleEdit}
            >
              Edit
            </Button>
          )}
        </Box>

        <form>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '-4px' }}>
            Organizational Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Organization Name</Typography>
              <TextField
                name="orgName"
                value={formData.orgName}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px',width: '70%', paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            {/* Category Field instead of dropdown */}
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Category</Typography>
              <TextField
                name="category"
                value={formData.category}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%', paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Phone</Typography>
              <TextField
                name="phone"
                value={formData.phone}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Street</Typography>
              <TextField
                name="street"
                value={formData.street}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>City</Typography>
              <TextField
                name="city"
                value={formData.city}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>State</Typography>
              <TextField
                name="state"
                value={formData.state}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Zip</Typography>
              <TextField
                name="zip"
                value={formData.zip}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Website</Typography>
              <TextField
                name="website"
                value={formData.website}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="subtitle2" gutterBottom sx={{ marginTop: '24px', fontWeight: 'bold'}}>
            Super Admin Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>First Name</Typography>
              <TextField
                name="firstName"
                value={formData.firstName}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px',width: '70%', paddingY: '2px', height: '30px'}
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Last Name</Typography>
              <TextField
                name="lastName"
                value={formData.lastName}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Phone</Typography>
              <TextField
                name="adminPhone"
                value={formData.adminPhone}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px', width: '70%',paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" gutterBottom>Email</Typography>
              <TextField
                name="email"
                value={formData.email}
                fullWidth
                disabled
                InputProps={{
                  sx: { backgroundColor: '#f9f9f9', borderRadius: '5px',width: '70%', paddingY: '2px', height: '30px' }
                }}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
      <ToastContainer />
    </Paper>
  );
}

export default ViewOrganization;
