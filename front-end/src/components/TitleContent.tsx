import React from 'react';
import { Box } from '@mui/material';
import ReactQuill from 'react-quill';
import DragHandle from './DragHandle';

interface TitleContentProps {
  item: {
    id: string;
    title: string;
    subtitle: string;
  };
  onTitleChange: (itemId: string, newContent: string) => void;
  onSubtitleChange: (itemId: string, newContent: string) => void;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
};

const TitleContent: React.FC<TitleContentProps> = ({
  item,
  onTitleChange,
  onSubtitleChange,
}) => {
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
          gap: 2,
        }}
      >
        <Box sx={{
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
          '& .ql-editor': {
            fontSize: '1.5rem',
            fontWeight: 'bold',
          },
        }}>
          <ReactQuill
            value={item.title}
            onChange={(content) => onTitleChange(item.id, content)}
            modules={quillModules}
            placeholder="Enter title..."
          />
        </Box>

        <Box sx={{
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
          '& .ql-editor': {
            fontSize: '1.1rem',
            color: '#666',
          },
        }}>
          <ReactQuill
            value={item.subtitle}
            onChange={(content) => onSubtitleChange(item.id, content)}
            modules={quillModules}
            placeholder="Enter subtitle..."
          />
        </Box>
      </Box>
    </Box>
  );
};

export default TitleContent; 