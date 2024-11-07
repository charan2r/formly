import React, { useState,useEffect } from 'react';
import { Paper, TextField, Typography, Grid, Box, IconButton, Button, CircularProgress } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';


function ViewOrganization() {
  const navigate = useNavigate();
  const { orgId } = useParams();
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/organization/details`, {
          params: { id: orgId }
        });
        const organization = response.data.data;
        
        setFormData({
          orgName: organization.organization.name,
          category: organization.organization.category,
          phone: organization.organization.phone,
          street: organization.organization.street,
          city: organization.organization.city,
          state: organization.organization.state,
          zip: organization.organization.zip,
          website: organization.organization.website,
          firstName: organization.superAdmin?.firstName || '',
          lastName: organization.superAdmin?.lastName || '',
          adminPhone: organization.superAdmin?.phoneNumber || '',
          email: organization.superAdmin?.email || '',
        });
      } catch (error) {
        setError("Failed to load organization details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizationDetails();
  }, [orgId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => navigate('/edit-organization')}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Organization Management
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight="bold">View Organization</Typography>
            <Typography variant="body2" color="textSecondary" marginBottom="20px">
              View your organization details.
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', borderRadius: '20px', paddingX: '30px' }}
            onClick={() => navigate('/edit-organization')}
          >
            Edit
          </Button>
        </Box>
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
    </Paper>
  );
}

export default ViewOrganization;
