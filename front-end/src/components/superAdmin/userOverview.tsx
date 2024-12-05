import React, { useEffect, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import CircleIcon from '@mui/icons-material/Circle';
import { ArrowForward, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
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
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axios';
// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const UserOverview: React.FC = () => {
  const { user } = useAuth();
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });
  const [doughnutData, setDoughnutData] = useState({ 
    labels: [], 
    datasets: [{ data: [], backgroundColor: [] }] 
  });
  const [topActivities, setTopActivities] = useState([]);

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
  }).slice(0, 3); 
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        if (!user?.organizationId) return;
        
        const response = await api.get(`/categories/organization/${user.organizationId}`);
        console.log(response.data);
        if (response.data.status === 'success') {
          const categories = response.data.data;
          
          // Count categories by status
          const categoryCount = categories.reduce((acc, category) => {
            if (category.status === 'active') {
              const categoryName = category.name;
              acc[categoryName] = (acc[categoryName] || 0) + 1;
            }
            return acc;
          }, {});

          // Calculate percentages
          const total = Object.values(categoryCount).reduce((sum: number, count: number) => sum + count, 0);
          const labels = Object.keys(categoryCount);
          const data = labels.map(label => ((categoryCount[label] / total) * 100).toFixed(1));

          // Set up pie chart data
          setCategoryData({
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: labels.map((_, index) => 
                index % 2 === 0 ? '#D3CEC4' : '#333'
              ),
            }],
          });
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [user?.organizationId]);

  // Fetch users and process role distribution
  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        if (!user?.organizationId) return;
        
        // Fetch users from the organization
        const response = await api.get(`/users?organizationId=${user.organizationId}`);
        
        if (response.data.status === 'success') {
          const users = response.data.data[0];
          
          // Count users by userType
          const roleCount = users.reduce((acc, user) => {
            if (!user.isDeleted) { // Only count active users
              acc[user.userType] = (acc[user.userType] || 0) + 1;
            }
            return acc;
          }, {});

          // Prepare data for doughnut chart
          const labels = Object.keys(roleCount);
          const data = Object.values(roleCount);
          const backgroundColors = labels.map((_, index) => 
            index % 2 === 0 ? '#D3CEC4' : '#333'
          );

          setDoughnutData({
            labels: labels,
            datasets: [{
              data: data,
              backgroundColor: backgroundColors,
            }]
          });
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
      }
    };

    fetchUserRoles();
  }, [user?.organizationId]);

  // Fetch users and process creation dates for bar chart
  useEffect(() => {
    const fetchUserCreationData = async () => {
      try {
        if (!user?.organizationId) return;
        
        const response = await api.get(`/users?organizationId=${user.organizationId}`);
        
        if (response.data.status === 'success') {
          const users = response.data.data[0];
          
          // Get date range for last 30 days
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(endDate.getDate() - 30);
          
          // Initialize dates object with zeros
          const dateData = {};
          for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            dateData[dateStr] = 0;
          }
          
          // Count users by creation date
          users.forEach(user => {
            const creationDate = new Date(user.createdAt).toISOString().split('T')[0];
            if (dateData.hasOwnProperty(creationDate)) {
              dateData[creationDate]++;
            }
          });

          const today = new Date().toISOString().split('T')[0];
          
          // Set bar chart data
          setBarData({
            labels: Object.keys(dateData),
            datasets: [{
              label: 'Users Created',
              data: Object.values(dateData),
              backgroundColor: Object.keys(dateData).map(date => 
                date === today ? '#252422' : '#d3d3d3'
              ),
            }]
          });
        }
      } catch (error) {
        console.error('Error fetching user creation data:', error);
      }
    };

    fetchUserCreationData();
  }, [user?.organizationId]);

  useEffect(() => {
    const fetchTopActivities = async () => {
      try {
        if (!user?.organizationId) return;
        const response = await api.get('/audit-trail/admin/top5');
        console.log(response.data);
        if (response.data.status === 'success') {
          setTopActivities(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching top activities:', error);
      }
    };

    fetchTopActivities();
  }, [user?.organizationId]);

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
    <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
        <IconButton onClick={() => console.log("Back arrow clicked")}>
          <CircleIcon style={{ color: 'black' }} />
        </IconButton>
        <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Organization
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Dashboard
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Dashboard</Typography>
        <Typography variant="body2" color="textSecondary" marginBottom="5px" marginTop="-10px">
          Manage your Team members and their account permissions here.
        </Typography>

        {/* Chart Section */}
        <Box display="flex" justifyContent="space-between" mt={8} height="300px" flexWrap="wrap">
          <Box
            width={{ xs: '100%', sm: '45%' }}
            height="100%"
            display="flex"
            flexDirection="column"
            ml={5} 
          >
            <Typography variant="h5" fontWeight='bold' gutterBottom>Sub Users </Typography>
            {/* Date Range */}
           
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

            {topActivities.map((activity, index) => {
              const label = formatDateLabel(activity.createdAt);
              console.log(activity);
              return (
                <Box key={index} display="flex" flexDirection="column" mt={4}>
                  <Typography variant="h6" color="textPrimary">{label}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircleIcon style={{ color: 'green', fontSize: '14px' }} />
                    <Typography variant="body2" color="textSecondary">
                      {activity.action} performed on {new Date(activity.createdAt).toLocaleString()} by {activity.type}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Box
            width={{ xs: '100%', sm: '35%' }}
            height="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" height="50%">
              <Typography variant="h6" gutterBottom>Categories</Typography>
              <Pie
                data={categoryData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          return `${label}: ${value}%`;
                        }
                      }
                    }
                  }
                }}
                style={{ height: '100%', width: '100%' }}
              />
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center" height="50%" marginTop={7}>
              <Typography variant="h6" gutterBottom>Users by Roles</Typography>
              <Doughnut
                data={doughnutData}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} (${percentage}%)`;
                        }
                      }
                    }
                  },
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
