import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Avatar, TextField, Grid, IconButton, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CircleIcon from '@mui/icons-material/Circle';
//import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import api from '../utils/axios';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    console.log(user?.userId);
    if (!user?.userId) return; 
    const fetchProfileData = async () => {
      try {
        const response = await api.get(`/users/details?userId=${user?.userId}`);
        console.log(response.data);
        setProfileData(response.data.data);
        console.log(response.data)
      } catch (error) {
        setError('Failed to fetch user details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user?.userId]);
  
  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await api.patch(`/users/edit?userId=${user.userId}`, profileData);
      setIsEditing(false);
    } catch (error) {
      setError('Failed to update profile details');
    }
  };

  const commonTextFieldStyles = {
    backgroundColor: 'white',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E0E0E0'
    },
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    height: '35px',
    '& input': {
      padding: '8px 16px'
    }
  };

  return (
    <Paper elevation={4} sx={{ 
      padding: '36px', 
      margin: '16px', 
      width: '100%', 
      borderRadius: 3, 
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      {/* Top Navigation Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
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
          <Typography sx={{ fontSize: '15px', color: 'text.secondary', fontWeight: 500 }}>
            Account Management
          </Typography>
        </Box>
      </Box>

      {/* Welcome and Edit button section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: '24px',
            fontWeight: '500'
          }}
        >
          Welcome, Admin
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            backgroundColor: 'black',
            textTransform: 'none',
            borderRadius: '4px',
            px: 3,
            py: 0.5,
            minWidth: 'unset'
          }}
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? 'Save' : 'Edit'}
          
        </Button>
      </Box>

      <Typography 
        sx={{ 
          color: '#666',
          fontSize: '14px',
          mb: 3
        }}
      >
        Tue, 07 June 2022
      </Typography>
      

      <Box
        sx={{
          height: '1px',
          backgroundColor: '#E0E0E0',
          width: '100%',
          mb: 3
        }}
      />

      {/* Profile Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Avatar 
          src="/path-to-image.jpg"
          sx={{ 
            width: 80,
            height: 80,
            borderRadius: '50%'
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: '500' }}>
                {profileData?.firstName} {profileData?.lastName}
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '14px' }}>
                {profileData?.email}
              </Typography>
            </Box>
           
          </Box>
        </Box>
      </Box>

      <form style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Full Name Section */}
        <Typography variant="subtitle2" sx={{ 
          color: '#000',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '4px'
        }}>
          Full name
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ 
              color: '#666',
              fontSize: '12px',
              display: 'block',
              marginBottom: '2px'
            }}>
              First Name
            </Typography>
            <TextField
              name="firstName"
              value={profileData?.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              fullWidth
              placeholder="Your First Name"
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                sx: commonTextFieldStyles
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ 
              color: '#666',
              fontSize: '12px',
              display: 'block',
              marginBottom: '2px'
            }}>
              Last Name
            </Typography>
            <TextField
              name="lastName"
              fullWidth
              placeholder="Your Last Name"
              value={profileData?.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              variant="outlined"
              disabled={!isEditing}
              InputProps={{
                sx: commonTextFieldStyles
              }}
            />
          </Grid>
        </Grid>

        {/* Contact Details Section */}
        <Typography variant="subtitle2" sx={{ 
          color: '#000',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '4px',
          marginTop: '16px'
        }}>
          Contact details
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ 
              color: '#666',
              fontSize: '12px',
              display: 'block',
              marginBottom: '2px'
            }}>
              Email
            </Typography>
            <TextField
              name="email"
              value={profileData?.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
              placeholder="Your Email"
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                sx: commonTextFieldStyles
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ 
              color: '#666',
              fontSize: '12px',
              display: 'block',
              marginBottom: '2px'
            }}>
              Phone number
            </Typography>
            <TextField
              name="phoneNumber"
              value={profileData?.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              fullWidth
              placeholder="+94 75 203 1111"
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                sx: commonTextFieldStyles
              }}
            />
          </Grid>
        </Grid>

        {/* Other Section */}
        <Typography variant="subtitle2" sx={{ 
          color: '#000',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '4px',
          marginTop: '16px'
        }}>
          Other
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ 
              color: '#666',
              fontSize: '12px',
              display: 'block',
              marginBottom: '2px'
            }}>
              Last Login
            </Typography>
            <TextField
              name="lastLogin"
              value={profileData?.updatedAt || ''}
              onChange={(e) => handleInputChange('lastLogin', e.target.value)}
              fullWidth
              placeholder="14.10.2024 19:30"
              disabled={!isEditing}
              variant="outlined"
              InputProps={{
                sx: commonTextFieldStyles
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" sx={{ 
              color: '#666',
              fontSize: '12px',
              display: 'block',
              marginBottom: '2px'
            }}>
              Role
            </Typography>
            <TextField
              name="role"
              value={profileData?.userType}
              onChange={(e) => handleInputChange('role', e.target.value)}
              fullWidth
              placeholder="Custom Role"
              variant="outlined"
              disabled={!isEditing}
              InputProps={{
                sx: commonTextFieldStyles
              }}
            />
          </Grid>
        </Grid>

        {/* Black box at bottom */}
        <Box
          sx={{
            width: '100%',
            height: '35px',
            backgroundColor: 'black',
            borderRadius: '3px',
            mt: 5,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
          }}
        />
      </form>
    </Paper>
  );
};

export default ProfileSettings;