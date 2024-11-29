import React from 'react';
import { Box, Radio, FormControlLabel, RadioGroup } from '@mui/material';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';

interface YesNoContentProps {
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

const YesNoContent: React.FC<YesNoContentProps> = ({
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

      {/* Yes/No Radio Buttons Preview */}
      <Box sx={{
        mt: 1,
        display: 'flex',
        flexDirection: 'column',
        opacity: 0.6,
      }}>
        <RadioGroup
          row
          sx={{
            gap: 4,
            ml: 1
          }}
        >
          <FormControlLabel
            value="yes"
            control={
              <Radio 
                disabled
                sx={{
                  color: '#999',
                  '&.Mui-disabled': {
                    color: '#999',
                  }
                }}
              />
            }
            label="Yes"
            sx={{
              color: '#999',
              '& .MuiTypography-root': {
                fontSize: '0.9rem',
              }
            }}
          />
          <FormControlLabel
            value="no"
            control={
              <Radio 
                disabled
                sx={{
                  color: '#999',
                  '&.Mui-disabled': {
                    color: '#999',
                  }
                }}
              />
            }
            label="No"
            sx={{
              color: '#999',
              '& .MuiTypography-root': {
                fontSize: '0.9rem',
              }
            }}
          />
        </RadioGroup>
      </Box>
    </Box>
  );
};

export default YesNoContent; 