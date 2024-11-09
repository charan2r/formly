import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
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
    { category: 'Super Admin' },
    { category: 'SubUser' },
    { category: 'SubUser' },
    { category: 'Super Admin' },
    { category: 'SubUser' },
    { category: 'SbUser' },
    { category: 'SubUser' },
    { category: 'SubUser' },
    { category: 'SubUser' },
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
    const totalUsers = categoryCount['Super Admin'] + categoryCount['SubUser'];
    const superAdminPercentage = ((categoryCount['Super Admin'] / totalUsers) * 110).toFixed(2);
    const subUserPercentage = ((categoryCount['SubUser'] / totalUsers) * 100).toFixed(2);

    const labels = ['Super Admin', 'SubUser'];
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
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden'  }}>
  <Box display="flex" flexDirection="column" gap={2}>
        {/* Header Section */}
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Dashboard</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="5px" marginTop="-10px">
          Manage your users and their account permissions here.
        </Typography>

        {/* Chart Section */}
        <Box display="flex" justifyContent="space-between" mt={2} height="300px" flexWrap="wrap">
          <Box
            width={{ xs: '100%', sm: '45%' }}
            height="100%"
            display="flex"
            flexDirection="column"

          >
            <Typography variant="h6"  gutterBottom>Sub Users </Typography>
            {/* Date Range */}
            <Typography variant="body2" fontSize={12} color="textSecondary" sx={{ color: 'rgb(180, 180, 180)', marginBottom: 1 }}>
              01 - 25 November 2024
            </Typography>
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: true,
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                    position: 'bottom',
                  },
                },
                scales: {
                  x: {
                    display: false,
                  },
                  y: {
                    display: false,
                    beginAtZero:true
                  },
                },
              }}
              height={25}
            />

            {sortedUserData.map((user, index) => {
          const label = formatDateLabel(user.createdAt);
          return (
            <Box key={index} display="flex" flexDirection="column" mt={4}>
              <Typography variant="h8" color="textPrimary">{label}</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <CircleIcon style={{ color: 'green', fontSize: '14px' }} />
                <Typography variant="body2" color="textSecondary">
                  User added on {user.createdAt} ({label})
                </Typography>
              </Box>
            </Box>
          );
        })}
          </Box>
         {/* Second Column with Charts */}
         <Box 
            width={{ xs: '100%', sm: '35%' }} 
            height="100%"
            display="flex" 
            flexDirection="column" 
            justifyContent="space-between"
            order={{ xs: 1, sm: 2 }}
          >
            {/* Pie Chart for Categories */}
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="50%">
                <Typography variant="h6" gutterBottom>Forms Categories</Typography>
                <Pie
    data={categoryData} // Use categoryData state
    options={{
      maintainAspectRatio: false,
      responsive: true,
    }}
    style={{ height: '100%', width: '100%' }}
  />
            </Box>
            {/* Doughnut Chart */}
            <Box display="flex" flexDirection="column" alignItems="center" height="50%" marginTop={7}>
              <Typography variant="h6" gutterBottom>Users</Typography>
              <Doughnut
                data={doughnutData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                }}
                style={{ height: '100%' }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserOverview;

