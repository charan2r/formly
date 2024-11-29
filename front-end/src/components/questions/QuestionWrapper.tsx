import React from 'react';
import { Box, IconButton } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReactQuill from 'react-quill';
import DragHandle from '../DragHandle';
import { BaseQuestionProps } from '../../types/questions';
import axios from 'axios';

export const QuestionWrapper: React.FC<BaseQuestionProps & { children: React.ReactNode }> = ({
  item,
  formFieldId,
  onQuestionChange,
  children
}) => {
  const handleDeleteFormField = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/form-fields/delete?id=${formFieldId}`);
      if (response.data.success) {
        console.log('Form field deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting form field:', error);
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
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
        <Box sx={{ mb: 2 }}>
          <Box sx={{
            position: 'relative',
            '& .ql-toolbar': {
              display: 'flex',
              position: 'absolute',
              right: '-40px',
              top: 0,
              zIndex: 1000,
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderRadius: '4px',
              padding: '8px 4px',
              flexDirection: 'column',
              opacity: 0,
              visibility: 'hidden',
              transition: 'opacity 0.3s ease, visibility 0.3s ease',
              '& .ql-formats': {
                margin: '4px 0',
              }
            },
            '&:hover .ql-toolbar': {
              opacity: 1,
              visibility: 'visible',
            },
            '& .ql-container': {
              border: 'none',
            },
          }}>
            <ReactQuill
              value={item.question}
              onChange={(content) => onQuestionChange(formFieldId, content)}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['link'],
                  ['clean']
                ],
              }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '4px',
              }}
            />
          </Box>
        </Box>
        {children}
      </Box>
    </Box>
  );
}; 