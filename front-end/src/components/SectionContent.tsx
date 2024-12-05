import React from 'react';
import { Box } from '@mui/material';
import DragHandle from './DragHandle';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { IconButton } from '@mui/material';
import api from '../utils/axios';

interface SectionContentProps {
  item: any;
  formFieldId: string;
}

const SectionContent: React.FC<SectionContentProps> = ({
  item,
  formFieldId,
}) => {
  // Add delete handler
  const handleDeleteFormField = async () => {
    try {
      const response = await api.delete(`/form-fields/delete?id=${formFieldId}`);
      if (response.data.success) {
        console.log('Section deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  return (
    <Box 
      sx={{ 
        position: 'relative',
        height: '100%',
        borderRadius: '8px',
        border: 'none',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.06)',
        }
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          position: 'relative',
          '&:hover .delete-form-field': {
            opacity: 1,
          },
        }}
      >
        <IconButton
          className="delete-form-field"
          onClick={handleDeleteFormField}
          sx={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: '#fff',
            boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 1000,
            padding: '4px',
            '&:hover': {
              backgroundColor: '#fee',
              color: '#f44336',
            },
            width: '24px',
            height: '24px',
            minWidth: 'auto',
          }}
          size="small"
        >
          <DeleteForeverIcon fontSize="small" />
        </IconButton>
        <DragHandle />
      </Box>
    </Box>
  );
};

export default SectionContent; 