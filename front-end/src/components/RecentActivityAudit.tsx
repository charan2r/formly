import React from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { AccessTime } from '@mui/icons-material'; // Import an icon for the timestamp

const RecentActivityAudit = () => {
  // Sample activities data; replace with your actual data fetching logic
  const activities = [
    { id: 1, text: 'Organization created - Tech Solutions', timestamp: '2024-11-03 10:30:00' },
    { id: 2, text: 'User updated - John Doe', timestamp: '2024-11-03 11:00:00' },
    { id: 2, text: 'User updated - John Doe', timestamp: '2024-11-03 11:00:00' },
    { id: 3, text: 'Organization deleted - Org One', timestamp: '2024-11-03 11:15:00' },
    // Add more activities as needed
  ];

  return (
    <Box marginTop={4}>
      <Typography variant="h6" gutterBottom>
        Recent Activity Audit
      </Typography>
      <Paper elevation={2} sx={{ padding: 2, maxHeight: '200px', overflow: 'auto', borderRadius: 2 }}>
        <List>
          {activities.map(activity => (
            <div key={activity.id}>
              <ListItem sx={{ padding: 0.2 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  <Box display="flex" alignItems="center" marginRight={5}>
                    <IconButton size="small" color="primary" sx={{ marginRight: 1 }}>
                      <AccessTime fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="textSecondary">
                      {activity.timestamp}
                    </Typography>
                  </Box>
                  <ListItemText 
                    primary={activity.text} 
                    primaryTypographyProps={{ fontWeight: 'regular' }} // Bold for activity text
                  />
                </Box>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default RecentActivityAudit;
