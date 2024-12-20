import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import api from '../utils/axios'; // Use the configured axios instance

interface Activity {
  id: number;
  text: string;
  timestamp: string;
  action: string;
  type: string;
}

const RecentActivityAudit = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const fetchSuperAdminActivities = async () => {
      try {
        const response = await api.get('/audit-trail/superadmin/top5'); // Adjust the endpoint as needed
        setActivities(response.data.data);
      } catch (error) {
        console.error('Error fetching superadmin activities:', error);
      }
    };

    fetchSuperAdminActivities();
  }, []);

  return (
    <Box marginTop={5}>
      <Typography variant="h6" gutterBottom>
        Recent Activity Audit
      </Typography>
      <List>
        {activities.map(activity => (
          <div key={activity.id}>
            <ListItem sx={{ padding: 0.4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Box display="flex" alignItems="center" marginRight={5}>
                  <IconButton size="small" color="black" sx={{ marginRight: 1 }}>
                    <AccessTime fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" color="textSecondary">
                    At {activity.timestamp}{' '}
                    <span style={{ color: '#757575' }}>{activity.action}</span> action was performed by{' '}
                    <span style={{ color: '#9e9e9e' }}>{activity.type}</span>
                  </Typography>
                </Box>
                <ListItemText 
                  primary={activity.text} 
                  primaryTypographyProps={{ fontWeight: 'regular', fontSize: 'small' }}
                />
              </Box>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Box>
  );
};

export default RecentActivityAudit;
