import React from 'react';
import { Box } from '@mui/material';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';

interface DateTimeContentProps {
  item: QuestionItem;
  formFieldId: string;
  onQuestionChange: (itemId: string, newContent: string) => void;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
};

const DateTimeContent: React.FC<DateTimeContentProps> = ({
  item,
  formFieldId,
  onQuestionChange,
}) => {
  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      p: 2,
      position: 'relative',
    }}>
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
            modules={quillModules}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
            }}
          />
        </Box>
      </Box>

      {/* DateTime Input Preview */}
      <Box sx={{
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        opacity: 0.7,
      }}>
        <input 
          type="datetime-local"
          disabled
          placeholder="MM/DD/YYYY HH:MM"
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#fff',
            width: '100%',
            color: '#999',
            opacity: 0.5,
            '&::placeholder': {
              color: '#999',
              opacity: 0.5,
            }
          }}
        />
      </Box>
    </Box>
  );
};

export default DateTimeContent; 