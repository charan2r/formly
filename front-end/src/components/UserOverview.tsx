import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import CircleIcon from '@mui/icons-material/Circle';
import { ArrowForward } from '@mui/icons-material';
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

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const UserOverview: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });

  // Sample data for Bar Chart (Users Created)
  const sampleUserData = [
    { createdAt: '2024-10-01' },
    { createdAt: '2024-10-02' },
    { createdAt: '2024-10-02' },
    { createdAt: '2024-10-04' },
    { createdAt: '2024-10-05' },
    { createdAt: '2024-10-05' },
    { createdAt: '2024-10-07' },
  ];

  // Sample data for Pie Chart (Categories)
  const sampleCategoryData = [
    { category: 'HR' },
    { category: 'R & D' },
    { category: 'R & D' },
    { category: 'HR' },
    { category: 'R & D' },
    { category: 'R & D' },
    { category: 'R & D' },
    { category: 'R & D' },
    { category: 'R & D' },
  ];

  useEffect(() => {
    const dateData = {};
    const startDate = new Date('2024-11-01');
    const endDate = new Date('2024-11-25');
    const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format
  
    // Initialize all dates in the range with random values
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      dateData[dateStr] = Math.floor(Math.random() * 15);
    }
  
    // Prepare labels, data, and background colors for the chart
    const labels = Object.keys(dateData);
    const data = Object.values(dateData);
    const backgroundColors = labels.map(date => (date === today ? '#252422' : '#d3d3d3'));
  
    setBarData({
      labels: labels,
      datasets: [
        {
          label: 'data',
          data: data,
          backgroundColor: backgroundColors,
        },
      ],
    });
  }, []);

  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
  
    if (date.toDateString() === today.toDateString()) {
      return "Today"; 
    } else {
      // Return a fully formatted date for all other dates
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const sortedUserData = sampleUserData.sort((a, b) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if 'a' or 'b' is from today
    if (a.createdAt === today) return -1;
    if (b.createdAt === today) return 1; 
  
    // For other dates, sort them by creation time (most recent first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 4);

  useEffect(() => {
    const categoryCount = {};
    sampleCategoryData.forEach(category => {
      if (category.category) {
        categoryCount[category.category] = (categoryCount[category.category] || 0) + 1;
      }
    });

    // Calculate percentages for Admin and User
    const totalUsers = categoryCount['HR'] + categoryCount['R & D'];
    const superAdminPercentage = ((categoryCount['HR'] / totalUsers) * 110).toFixed(2);
    const subUserPercentage = ((categoryCount['R & D'] / totalUsers) * 100).toFixed(2);

    const labels = ['HR', 'R & D'];
    const data = [superAdminPercentage, subUserPercentage];

    setCategoryData({
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ['#D3CEC4', '#333'],
        },
      ],
    });
  }, []);

  const doughnutData = React.useMemo(() => ({
    labels: ['Super Admins', 'Sub Users'],
    datasets: [
      {
        data: [2,5 ],
        backgroundColor: ['#D3CEC4', '#333'],
      },
    ],
  }), []);

  return (
    <Paper 
      elevation={4} 
      sx={{ 
        padding: { xs: '16px', sm: '24px', md: '36px' },
        margin: { xs: '8px', sm: '12px', md: '16px' },
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Header Section */}
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton 
            onClick={() => console.log("Back arrow clicked")}
            sx={{ padding: { xs: '4px', sm: '8px' } }}
          >
            <CircleIcon style={{ color: 'black', fontSize: isMobile ? '16px' : '24px' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black', fontSize: isMobile ? '16px' : '24px' }} />
          <Typography variant={isMobile ? "body2" : "body1"} color="textSecondary">
            Dashboard
          </Typography>
        </Box>
        
        <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold">Dashboard</Typography>
        <Typography 
          variant="body2" 
          color="textSecondary" 
          marginBottom="5px" 
          marginTop="-10px"
          sx={{ fontSize: { xs: '12px', sm: '14px' } }}
        >
          Manage your users and their account permissions here.
        </Typography>

        {/* Chart Section */}
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between" 
          mt={2} 
          gap={4}
        >
          {/* First Column - Bar Chart */}
          <Box
            width={{ xs: '100%', md: '45%' }}
            minHeight={{ xs: '400px', md: '300px' }}
            display="flex"
            flexDirection="column"
          >
            <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>Sub Users</Typography>
            <Typography 
              variant="body2" 
              fontSize={isMobile ? 10 : 12} 
              color="textSecondary" 
              sx={{ color: 'rgb(180, 180, 180)', marginBottom: 1 }}
            >
              01 - 25 November 2024
            </Typography>
            
            <Box height={{ xs: '200px', sm: '250px', md: '300px' }}>
              <Bar
                data={barData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                      beginAtZero: true
                    },
                  },
                }}
              />
            </Box>

            {sortedUserData.map((user, index) => {
              const label = formatDateLabel(user.createdAt);
              return (
                <Box key={index} display="flex" flexDirection="column" mt={2}>
                  <Typography variant="subtitle2" color="textPrimary">{label}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircleIcon style={{ color: 'green', fontSize: isMobile ? '12px' : '14px' }} />
                    <Typography 
                      variant="body2" 
                      color="textSecondary"
                      sx={{ fontSize: { xs: '11px', sm: '14px' } }}
                    >
                      User added on {user.createdAt} ({label})
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>

          {/* Second Column - Pie & Doughnut Charts */}
          <Box 
            width={{ xs: '100%', md: '55%' }}
            display="flex" 
            flexDirection="column" 
            gap={4}
          >
            {/* Pie Chart */}
            <Box height={{ xs: '250px', sm: '300px' }}>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                align="center" 
                gutterBottom
              >
                Forms Categories
              </Typography>
              <Pie
                data={categoryData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </Box>

            {/* Doughnut Chart */}
            <Box height={{ xs: '250px', sm: '300px' }}>
              <Typography 
                variant={isMobile ? "subtitle1" : "h6"} 
                align="center" 
                gutterBottom
              >
                Users
              </Typography>
              <Doughnut
                data={doughnutData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserOverview;
