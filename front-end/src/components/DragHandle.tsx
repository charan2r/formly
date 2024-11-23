import React from 'react';
import { Box, Typography } from '@mui/material';

const DragHandle: React.FC = () => {
  return (
    <Box 
      className="drag-handle" 
      sx={{ 
        position: 'absolute',
        top: '8px',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '24px',
        padding: '0 12px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        color: 'white',
        borderRadius: '12px',
        cursor: 'move',
        display: 'flex',
        alignItems: 'center',
        opacity: 0,
        transition: 'opacity 0.2s ease-in-out',
        zIndex: 1000,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      <Typography variant="caption" sx={{ userSelect: 'none' }}>
        Drag to move
      </Typography>
    </Box>
  );
};

export default DragHandle; 