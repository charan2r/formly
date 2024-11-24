import React from 'react';
import { Box, Typography, Button, Radio, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';

interface QuestionContentProps {
  item: QuestionItem;
  onQuestionChange: (itemId: string, newContent: string) => void;
  onOptionChange: (itemId: string, optionId: number, newContent: string) => void;
  onDeleteOption: (itemId: string, optionId: number) => void;
  onAddOption: (itemId: string) => void;
}

const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

const QuestionContent: React.FC<QuestionContentProps> = ({
  item,
  onQuestionChange,
  onOptionChange,
  onDeleteOption,
  onAddOption,
}) => {
   // Add conditional rendering based on type
   const renderContent = () => {
    switch (item.type) {
      case 'checkbox':
      case 'yes-no':
        return (
          <>
            <ReactQuill
              value={item.question}
              onChange={(content) => onQuestionChange(item.id, content)}
              modules={quillModules}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '4px',
              }}
              preserveWhitespace={true}
            />
            {item.options?.map((option) => (
              // ... existing option rendering code ...
              console.log('hello')
            ))}
            <Button
              className="add-option"
              startIcon={<AddIcon />}
              onClick={() => onAddOption(item.id)}
              // ... existing button styles ...
            >
              Add Option
            </Button>
          </>
        );
      default:
        return (
          <Box sx={{ /* existing styles */ }}>
      <DragHandle />
      <Box sx={{ /* existing styles */ }}>
        {renderContent()}
      </Box>
    </Box>
        );
    }
  };
  return (
    <Box 
      sx={{ 
        position: 'relative',
        height: '100%',
        '&:hover .drag-handle': {
          opacity: 1,
        },
      }}
    >
      <DragHandle />
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        <Box sx={{ mb: 2 }}>
         
          
          <Box sx={{
            position: 'relative',
            '& .ql-toolbar': {
              display: 'none',
            },
            '&:hover .ql-toolbar': {
              display: 'block',
              borderBottom: '1px solid #ccc',
              backgroundColor: '#fff',
            },
            '& .ql-container': {
              border: 'none',
            },
            '&:hover .ql-container': {
              borderTop: 'none',
            },
          }}>
            <ReactQuill
              value={item.question}
              onChange={(content) => onQuestionChange(item.id, content)}
              modules={quillModules}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '4px',
              }}
              preserveWhitespace={true}
            />
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5,
          '&:hover .add-option': {
            opacity: 1,
          },
        }}>
          {/* {item.options.map((option) => (
            <Box
              key={option.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1.5,
                p: 1,
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                backgroundColor: '#ffffff',
                '& .delete-icon': {
                  opacity: 0,
                  transition: 'opacity 0.2s',
                },
                '&:hover .delete-icon': {
                  opacity: 1,
                },
              }}
            >
              <Radio
                size="small"
                sx={{
                  color: '#757575',
                  '&.Mui-checked': {
                    color: '#2196f3',
                  },
                }}
              />
              <Box sx={{ 
                flex: 1,
                '& .ql-toolbar': {
                  display: 'none',
                },
                '&:hover .ql-toolbar': {
                  display: 'block',
                  borderBottom: '1px solid #ccc',
                  backgroundColor: '#fff',
                },
                '& .ql-container': {
                  border: 'none',
                },
                '&:hover .ql-container': {
                  borderTop: 'none',
                },
              }}>
                <ReactQuill
                  value={option.text}
                  onChange={(content) => onOptionChange(item.id, option.id, content)}
                  modules={quillModules}
                  style={{
                    backgroundColor: '#ffffff',
                  }}
                />
              </Box>
              <IconButton 
                className="delete-icon"
                size="small" 
                onClick={() => onDeleteOption(item.id, option.id)}
                sx={{ 
                  color: '#757575',
                  '&:hover': { color: '#f44336' },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))} */}
          
          <Button
            className="add-option"
            startIcon={<AddIcon />}
            onClick={() => onAddOption(item.id)}
            sx={{
              mt: 1,
              opacity: 0,
              transition: 'opacity 0.2s',
              color: '#2196f3',
              borderColor: '#2196f3',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.04)',
              }
            }}
          >
            Add Option
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionContent; 