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
import axios from 'axios';
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

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Overview: React.FC = () => {
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [categoryData, setCategoryData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/organization');
        const organizations = response.data.data;
  
        // Process data to count organizations created on each date
        const dateCount = {};
        organizations.forEach(org => {
          const date = new Date(org.createdAt).toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
          dateCount[date] = (dateCount[date] || 0) + 1; // Count organizations per date
        });
  
        // Prepare data for the bar chart
        const sortedEntries = Object.entries(dateCount).sort((a, b) => new Date(a[0]) - new Date(b[0])); // Sort by date
        const labels = sortedEntries.map(entry => entry[0]); // Get sorted dates
        const data = sortedEntries.map(entry => entry[1]); // Get counts for sorted dates
  
        setBarData({
          labels: labels,
          datasets: [
            {
              label: 'Organizations Created',
              data: data,
              backgroundColor: '#333',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };
  
    fetchOrganizations();
  }, []);

  // Fetch category data for the Pie chart
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3001/organization'); // Adjust your API endpoint here
        const categories = response.data.data; // Assuming categories are returned as an array

        // Process categories for the Pie chart
        const categoryCount = {};
        categories.forEach(category => {
          if (category.category) { // Ensure the category is not null
            categoryCount[category.category] = (categoryCount[category.category] || 0) + 1; // Count occurrences
          }
        });

        // Prepare data for the Pie chart
        const labels = Object.keys(categoryCount);
        const data = Object.values(categoryCount);

        setCategoryData({
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: ['#333', '#FFFFFF', '#CCCCCC', '#808080', '#333333'], // Black and white shades
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Data for the doughnut chart (optional, modify as needed)
  const doughnutData = React.useMemo(() => ({
    labels: ['Super Admins', 'Sub Users'],
    datasets: [
      {
        data: [92, 85],
        backgroundColor: ['#D3CEC4', '#333'],
      },
    ],
  }), []);

  return (
    <Paper elevation={4} sx={{ padding: '36px', margin: '16px', width: '100%', borderRadius: 3, overflow: 'hidden' }}>
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
          Manage your organizations and their account permissions here.
        </Typography>

        {/* Chart Section */}
        <Box display="flex" justifyContent="space-between" mt={2} height="300px" flexWrap="wrap">
          <Box 
            width={{ xs: '100%', sm: '60%' }} 
            height="100%"
            display="flex"
            flexDirection="column" // Stack items vertically
            order={{ xs: 2, sm: 1 }}
          >
            <Typography variant="h6" gutterBottom>Organizations Created</Typography>
            <Bar
              data={barData}
              options={{
                maintainAspectRatio: true,
                responsive: true,
                plugins: {
                    legend: {
                      display: true, // Hides the legend
                      position: 'bottom',
                    },
                  },
                  scales: {
                    x: {
                      display: false, // Hides the x-axis labels
                    },
                    y: {
                      display: false, // Hides the y-axis labels
                    },
                  },
              }}
              height={'70%'}
            />
            
            {/* Recent Activity Audit Section */}
            <RecentActivityAudit />
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
                <Typography variant="h6" gutterBottom>Organization Categories</Typography>
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

export default Overview;
