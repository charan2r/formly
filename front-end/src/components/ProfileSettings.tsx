import React from 'react';
import { Box, Typography, Button, Avatar, TextField, Grid, IconButton } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForward from '@mui/icons-material/ArrowForward';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ 
      padding: '20px',
      maxWidth: '100%',
      margin: '0 auto',
      backgroundColor: 'white',
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: '250px',
      overflow: 'auto'
    }}>
      {/* Top Navigation Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Account Management
          </Typography>
        </Box>
        <Button variant="contained" sx={{ backgroundColor: 'black' }}>
          Edit
        </Button>
      </Box>

      <Typography variant="h4" sx={{ mb: 1 }}>
        Welcome, {user?.email?.split('@')[0]}
      </Typography>
      
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {new Date().toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
        <Avatar 
          sx={{ 
            width: 100,
            height: 100,
            bgcolor: 'black'
          }}
        >
          {user?.email?.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6">{user?.email?.split('@')[0]}</Typography>
          <Typography color="text.secondary">{user?.email}</Typography>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" sx={{ mr: 2 }}>
              Upload new picture
            </Button>
            <Button variant="outlined" color="error">
              Delete
            </Button>
          </Box>
        </Box>
      </Box>

      <form>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Full name
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstName"
              fullWidth
              placeholder="First Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastName"
              fullWidth
              placeholder="Last Name"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px' }
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', marginTop: '20px' }}>
          Contact details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              fullWidth
              placeholder="Your Email"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="phoneNumber"
              fullWidth
              placeholder="Phone number"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px' }
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold', marginTop: '20px' }}>
          Other
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastLogin"
              fullWidth
              placeholder="Last Login"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="role"
              fullWidth
              placeholder="Custom Role"
              InputProps={{
                sx: { backgroundColor: '#f9f9f9', borderRadius: '5px' }
              }}
            />
          </Grid>
        </Grid>
      </form>

      <Button 
        variant="contained" 
        sx={{ 
          mt: 2,
          backgroundColor: 'black',
          '&:hover': {
            backgroundColor: '#333'
          }
        }}
      >
        Save Changes
      </Button>
    </Box>
  );
};

export default ProfileSettings; 