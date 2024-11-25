import React, { useState, useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import DragHandle from './DragHandle';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface TitleContentProps {
  item: QuestionItem;
  formFieldId: string;
  onTitleChange: (itemId: string, newContent: string) => void;
  onSubtitleChange: (itemId: string, optionId: string, newContent: string) => void;
  onDeleteSubtitle: (itemId: string, optionId: string) => void;
  onAddSubtitle: (itemId: string) => void;
  viewMode?: boolean;
}

interface Subtitle {
  formFieldsOptionId: string;
  option: string;
  formFieldId: string;
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

const subtitleQuillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }],
    ['clean']
  ],
};

const TitleContent: React.FC<TitleContentProps> = ({
  item,
  formFieldId,
  onTitleChange,
  onSubtitleChange,
  onDeleteSubtitle,
  onAddSubtitle,
  viewMode = false,
}) => {
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/form-fields-options`, {
          params: { formFieldId: formFieldId }
        });
        if (response.data.success) {
          setSubtitles(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching subtitles:', error);
      }
    };

    fetchSubtitles();
  }, [formFieldId]);

  const handleAddSubtitle = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/form-fields-options/create`, {
        option: 'New Subtitle',
        formFieldId: formFieldId
      });

      if (response.data.success) {
        setSubtitles(prevSubtitles => [...prevSubtitles, response.data.data]);
      }
    } catch (error) {
      console.error('Error adding subtitle:', error);
    }
  };

  const handleSubtitleChange = async (formFieldsOptionId: string, newContent: string) => {
    try {
      setSubtitles(prevSubtitles => 
        prevSubtitles.map(sub => 
          sub.formFieldsOptionId === formFieldsOptionId 
            ? { ...sub, option: newContent }
            : sub
        )
      );

      await axios.patch(`http://localhost:3001/form-fields-options/update?optionId=${formFieldsOptionId}`, {
        option: newContent,
        formFieldId: formFieldId
      });
    } catch (error) {
      console.error('Error updating subtitle:', error);
      const response = await axios.get(`http://localhost:3001/form-fields-options`, {
        params: { formFieldId: formFieldId }
      });
      if (response.data.success) {
        setSubtitles(response.data.data);
      }
    }
  };

  const handleDeleteSubtitle = async (formFieldsOptionId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3001/form-fields-options/delete`, {
        params: { optionId: formFieldsOptionId }
      });

      if (response.data.success) {
        setSubtitles(prevSubtitles => 
          prevSubtitles.filter(sub => sub.formFieldsOptionId !== formFieldsOptionId)
        );
      }
    } catch (error) {
      console.error('Error deleting subtitle:', error);
    }
  };

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
    <Box 
      sx={{ 
        position: 'relative',
        height: '100%',
        '&:hover .drag-handle': {
          opacity: 1,
        },
        '&:hover .delete-form-field': {
          opacity: 1,
        },
        '& .delete-icon, & .add-subtitle': {
          display: viewMode ? 'none' : 'flex',
        },
        '& .ql-toolbar': {
          display: viewMode ? 'none' : 'block',
        },
        '& .ql-container': {
          border: viewMode ? 'none' : '1px solid #ccc',
        },
        '& .ql-editor': {
          padding: viewMode ? '0' : '12px 15px',
        },
      }}
    >
      <IconButton
        className="delete-form-field"
        onClick={handleDeleteFormField}
        sx={{
          position: 'absolute',
          top: '-12px',
          right: '-12px',
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
        }}
        size="small"
      >
        <DeleteForeverIcon fontSize="small" />
      </IconButton>

      <DragHandle />
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
        }}
      >
        {/* Title Editor */}
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
              onChange={(content) => onTitleChange(item.id, content)}
              modules={quillModules}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '4px',
              }}
              preserveWhitespace={true}
            />
          </Box>
        </Box>

        {/* Subtitles Section */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 1.5,
          '&:hover .add-subtitle': {
            opacity: 1,
          },
        }}>
          {subtitles.map((subtitle) => (
            <Box
              key={subtitle.formFieldsOptionId}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                position: 'relative',
                '&:hover .delete-icon': {
                  opacity: 1,
                },
                pl: 0,
              }}
            >
              <Box sx={{ 
                flex: 1,
                position: 'relative',
                '& .ql-toolbar': {
                  display: 'flex',
                  position: 'absolute',
                  right: '-35px',
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
                '& .ql-editor': {
                  padding: '4px 0',
                  fontSize: '1rem',
                  color: '#666',
                },
              }}>
                <ReactQuill
                  key={`editor-${subtitle.formFieldsOptionId}`}
                  value={subtitle.option}
                  onChange={(content) => handleSubtitleChange(subtitle.formFieldsOptionId, content)}
                  modules={subtitleQuillModules}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                />
              </Box>
              <IconButton 
                className="delete-icon"
                size="small" 
                onClick={() => handleDeleteSubtitle(subtitle.formFieldsOptionId)}
                sx={{ 
                  color: '#757575',
                  opacity: 0,
                  transition: 'opacity 0.2s ease',
                  '&:hover': { 
                    color: '#f44336'
                  },
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          
          {/* Add Subtitle Button */}
          <Box
            className="add-subtitle"
            onClick={handleAddSubtitle}
            sx={{
              mt: 1,
              opacity: 0,
              transition: 'opacity 0.2s',
              color: '#2196f3',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.04)',
              }
            }}
          >
            <AddIcon />
            Add Subtitle
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TitleContent; 