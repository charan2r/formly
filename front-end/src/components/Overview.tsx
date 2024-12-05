import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import CircleIcon from '@mui/icons-material/Circle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import RecentActivityAudit from './RecentActivityAudit';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Overview: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isAuthenticated, user } = useAuth();
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTypesData, setUserTypesData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await api.get('/organization');
        const organizations = response.data.data;
  
        // Process data to count organizations created on each date
        const dateCount = {};
        organizations.forEach(org => {
          const date = new Date(org.createdAt).toISOString().split('T')[0];
          dateCount[date] = (dateCount[date] || 0) + 1;
        });
  
        const sortedEntries = Object.entries(dateCount)
          .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        
        setBarData({
          labels: sortedEntries.map(([date]) => date),
          datasets: [{
            label: 'Organizations Created',
            data: sortedEntries.map(([, count]) => count),
            backgroundColor: '#333',
          }],
        });
      } catch (error) {
        console.error('Error fetching organizations:', error);
        setError('Failed to fetch organization data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrganizations();
    }
  }, [isAuthenticated]);

  // Fetch category data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get('/organization');
        const categories = response.data.data;

        const categoryCount = {};
        categories.forEach(category => {
          if (category.category) {
            categoryCount[category.category] = (categoryCount[category.category] || 0) + 1;
          }
        });

        setCategoryData({
          labels: Object.keys(categoryCount),
          datasets: [{
            data: Object.values(categoryCount),
            backgroundColor: ['#333', '#FFFFFF', '#CCCCCC', '#808080', '#333333'],
          }],
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to fetch category data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  // Add new useEffect for fetching user types data
  useEffect(() => {
    const fetchUserTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await api.get('/organization/user-types-count');
        const userTypeCounts = response.data.data;

        setUserTypesData({
          labels: Object.keys(userTypeCounts),
          datasets: [{
            data: Object.values(userTypeCounts),
            backgroundColor: [
              '#333333', // Dark gray for SuperAdmin
              '#666666', // Medium gray for Admin
              '#999999', // Light gray for User
              '#CCCCCC', // Very light gray for other types
            ],
            borderColor: '#FFFFFF',
            borderWidth: 1,
          }],
        });
      } catch (error) {
        console.error('Error fetching user types:', error);
        setError('Failed to fetch user type data');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserTypes();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        padding: { xs: '16px', sm: '24px', md: '36px' },
        margin: { xs: '8px', sm: '12px', md: '16px' },
        width: '100%', 
        borderRadius: 3, 
        overflow: 'hidden' 
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Header Section */}
        <Box display="flex" alignItems="center" gap={1} marginLeft={isMobile ? 0 : "-10px"}>
          <IconButton 
            onClick={() => console.log("Back arrow clicked")}
            sx={{ padding: isMobile ? '4px' : '8px' }}
          >
            <CircleIcon style={{ color: 'black', fontSize: isMobile ? '1.2rem' : '1.5rem' }} />
          </IconButton>
          <ChevronRightIcon sx={{ 
            color: 'black', 
            fontSize: isMobile ? '1.2rem' : '1.5rem' 
          }} />
          <Typography variant={isMobile ? "caption" : "body2"} color="textSecondary">
            Dashboard
          </Typography>
        </Box>
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">Dashboard</Typography>
        <Typography 
          variant={isMobile ? "caption" : "body2"} 
          color="textSecondary" 
          marginBottom="5px" 
          marginTop="-10px"
        >
          Manage your organizations and their account permissions here.
        </Typography>

        {/* Chart Section */}
        <Box 
          display="flex" 
          flexDirection={isTablet ? 'column' : 'row'}
          justifyContent="space-between" 
          mt={2} 
          minHeight={isTablet ? 'auto' : '300px'}
          gap={isTablet ? 4 : 0}
        >
          {/* First Column with Bar Chart and Recent Activity */}
          <Box 
            width={isTablet ? '100%' : '60%'}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <Box>
              <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                Organizations Created
              </Typography>
              <Box height={isMobile ? '200px' : '250px'}>
                <Bar
                  data={barData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                      },
                    },
                    scales: {
                      x: {
                        display: false,
                      },
                      y: {
                        display: false,
                      },
                    },
                  }}
                />
              </Box>
            </Box>
            
            <RecentActivityAudit />
          </Box>

          {/* Second Column with Charts */}
          <Box 
            width={isTablet ? '100%' : '35%'}
            display="flex" 
            flexDirection="column" 
            gap={4}
          >
            {/* Pie Chart */}
            <Box>
              <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom align="center">
                Organization Categories
              </Typography>
              <Box height={isMobile ? '200px' : '250px'}>
                <Pie
                  data={categoryData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                  }}
                />
              </Box>
            </Box>

            {/* Users Section */}
            <Box>
              <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom align="center">
                Users by Type
              </Typography>
              <Box height={isMobile ? '200px' : '250px'}>
                <Doughnut
                  data={userTypesData}
                  options={{
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          padding: 20,
                          font: {
                            size: 12
                          }
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                          }
                        }
                      }
                    },
                    cutout: '60%',
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default Overview;
