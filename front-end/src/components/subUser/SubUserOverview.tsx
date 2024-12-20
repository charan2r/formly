import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People as PeopleIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  FileCopy as TemplateIcon,
  ChevronRight as ChevronRightIcon,
  Circle as CircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface QuickAccessCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  isDisabled: boolean;
}

// Custom theme colors for black and white
const themeColors = {
  background: '#ffffff',
  paper: '#ffffff',
  text: {
    primary: '#000000',
    secondary: '#666666',
  },
  card: {
    background: '#ffffff',
    hover: '#f0f0f0',
    disabled: 'rgba(0, 0, 0, 0.05)',
  },
  icon: {
    primary: '#000000',
    disabled: '#999999'
  },
  border: '#e0e0e0',
};

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  title,
  description,
  icon,
  path,
  isDisabled
}) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: '100%',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        background: themeColors.card.background,
        opacity: isDisabled ? 0.5 : 1,
        border: `1px solid ${themeColors.border}`,
        borderRadius: '16px',
        '&:hover': {
          transform: isDisabled ? 'none' : 'translateY(-4px)',
          backgroundColor: isDisabled ? themeColors.card.background : themeColors.card.hover,
        },
      }}
      onClick={() => !isDisabled && navigate(path)}
    >
      <CardContent sx={{ p: 3 }}>
        <Box 
          display="flex" 
          alignItems="center" 
          mb={2}
          sx={{
            background: isDisabled ? '#f5f5f5' : '#f8f8f8',
            borderRadius: '8px',
            p: 1.5,
            width: 'fit-content'
          }}
        >
          {React.cloneElement(icon as React.ReactElement, {
            sx: { 
              fontSize: 32, 
              color: isDisabled ? themeColors.icon.disabled : themeColors.icon.primary 
            }
          })}
        </Box>
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            color: themeColors.text.primary,
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: themeColors.text.secondary,
            lineHeight: 1.6
          }}
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};

const SubUserOverview: React.FC = () => {
  const { user } = useAuth();
  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false;
  };

  const quickAccessItems = [
    {
      title: 'Users',
      description: 'Manage and view organization users',
      icon: <PeopleIcon />,
      path: '/users',
      requiredPermission: 'View User'
    },
    {
      title: 'Categories',
      description: 'Organize and manage categories',
      icon: <CategoryIcon />,
      path: '/categories',
      requiredPermission: 'View Category'
    },
    {
      title: 'Forms',
      description: 'Create and manage forms',
      icon: <AssignmentIcon />,
      path: '/forms',
      requiredPermission: 'View Form'
    },
    {
      title: 'Templates',
      description: 'Design and manage templates',
      icon: <TemplateIcon />,
      path: '/templates',
      requiredPermission: 'View Template'
    },
  ];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        padding: { xs: '24px', md: '36px' },
        margin: '16px',
        width: '100%',
        borderRadius: '24px',
        backgroundColor: themeColors.paper,
        border: `1px solid ${themeColors.border}`,
      }}
    >
      <Box display="flex" flexDirection="column" gap={3}>
        {/* Breadcrumb */}
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton sx={{ color: themeColors.icon.primary }}>
            <CircleIcon />
          </IconButton>
          <ChevronRightIcon sx={{ fontSize: 26, color: themeColors.icon.primary }} />
          <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
            Dashboard
          </Typography>
        </Box>

        {/* Welcome Section */}
        <Box 
          mb={2}
          sx={{
            background: themeColors.background,
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(33, 150, 243, 0.1)'
          }}
        >
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ 
              color: themeColors.text.primary,
              mb: 1,
            }}
          >
            Welcome back, {user?.email?.split('@')[0]}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: themeColors.text.secondary,
              mt: 1,
              fontSize: '1.1rem'
            }}
          >
            Access your permitted features and manage your tasks efficiently.
          </Typography>
        </Box>

        {/* Quick Access Section */}
        <Box mt={1}>
          <Typography 
            variant="h5" 
            gutterBottom 
            fontWeight="600" 
            sx={{ 
              color: themeColors.text.primary,
              mb: 3
            }}
          >
            Quick Access
          </Typography>
          <Grid container spacing={4} mt={1}>
            {quickAccessItems.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Tooltip 
                  title={!hasPermission(item.requiredPermission) ? "You don't have permission to access this feature" : ""}
                  placement="top"
                >
                  <div>
                    <QuickAccessCard
                      title={item.title}
                      description={item.description}
                      icon={item.icon}
                      path={item.path}
                      isDisabled={!hasPermission(item.requiredPermission)}
                    />
                  </div>
                </Tooltip>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Information Section */}
        <Box mt={6}>
          <Typography 
            variant="h5" 
            gutterBottom 
            fontWeight="600" 
            sx={{ color: themeColors.text.primary, mb: 3 }}
          >
            Important Information
          </Typography>
          <Grid container spacing={4} mt={1}>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: themeColors.background,
                borderRadius: '20px',
                border: `1px solid ${themeColors.border}`,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: themeColors.text.primary }}>
                    Getting Started
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: themeColors.text.secondary }}>
                    • Your access is based on your assigned role and permissions
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: themeColors.text.secondary }}>
                    • Contact your administrator for additional access requests
                  </Typography>
                  <Typography variant="body2" sx={{ color: themeColors.text.secondary }}>
                    • Keep your account secure by regularly updating your password
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ 
                background: themeColors.background,
                borderRadius: '20px',
                border: `1px solid ${themeColors.border}`,
                height: '100%'
              }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: themeColors.text.primary }}>
                    Need Help?
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: themeColors.text.secondary }}>
                    If you need assistance or have questions about your access:
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: themeColors.text.secondary }}>
                    1. Check your assigned permissions
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: themeColors.text.secondary }}>
                    2. Review the user documentation
                  </Typography>
                  <Typography variant="body2" paragraph sx={{ color: themeColors.text.secondary }}>
                    3. Contact your organization administrator
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  );
};

export default SubUserOverview; 