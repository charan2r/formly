import React from 'react';
import { Box, Typography, Button, Avatar, TextField, Grid, IconButton, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            <KeyboardBackspaceRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
          <CircleIcon sx={{ fontSize: 22, color: 'black' }} />
          <ChevronRightIcon sx={{ fontSize: 22, color: 'black' }} />
          <Typography sx={{ fontSize: '15px', color: 'textSecondary', fontWeight: 500 }}>
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
        >
          Edit
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
                admin
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '14px' }}>
              admin@example.com
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: 'black',
                  textTransform: 'none',
                  borderRadius: '4px',
                  px: 2,
                  py: 1
                }}
              >
                Upload new picture
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  backgroundColor: '#FF5B5B',
                  textTransform: 'none',
                  borderRadius: '4px',
                  px: 2,
                  py: 1,
                  '&:hover': {
                    backgroundColor: '#ff4444'
                  }
                }}
              >
                Delete
              </Button>
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
              fullWidth
              placeholder="Your First Name"
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
              variant="outlined"
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
              fullWidth
              placeholder="Your Email"
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
              fullWidth
              placeholder="+94 75 203 1111"
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
              fullWidth
              placeholder="14.10.2024 19:30"
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
              fullWidth
              placeholder="Custom Role"
              variant="outlined"
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