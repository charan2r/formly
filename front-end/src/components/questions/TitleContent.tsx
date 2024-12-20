import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../../types/questions';
import DragHandle from '../DragHandle';
import api from '../../utils/axios';

interface TitleContentProps {
  item: QuestionItem;
  formFieldId: string;
  onTitleChange: (itemId: string, newContent: string) => void;
  onSubtitleChange: (itemId: string, optionId: string, newContent: string) => void;
  onDeleteSubtitle: (itemId: string, optionId: string) => void;
  onAddSubtitle: (itemId: string) => void;
  onEditorFocus: (fieldId: string, editorId: string, quill: any) => void;
  activeFieldId: string | null;
  activeEditorId: string | null;
}

interface Option {
  formFieldsOptionId: string;
  option: string;
  formFieldId: string;
}

const TitleContent: React.FC<TitleContentProps> = ({
  item,
  formFieldId,
  onTitleChange,
  onSubtitleChange,
  onDeleteSubtitle,
  onAddSubtitle,
  onEditorFocus,
  activeFieldId,
  activeEditorId,
}) => {
  const titleEditorId = `title-${formFieldId}`;
  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (activeFieldId === formFieldId) {
      console.log('🎯 Active Editor in TitleContent:', {
        fieldId: formFieldId,
        editorId: activeEditorId,
        isTitleEditor: activeEditorId === titleEditorId,
        timestamp: new Date().toISOString()
      });
    }
  }, [activeFieldId, activeEditorId]);

  const handleDeleteFormField = async () => {
    try {
      const response = await api.delete(`/form-fields/delete?id=${formFieldId}`);
      if (response.data.success) {
        console.log('Form field deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting form field:', error);
    }
  };

  const handleFocus = () => {
    if (editorRef.current) {
      onEditorFocus(formFieldId, titleEditorId, editorRef.current);
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%' }}>
      <Box sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2,
        position: 'relative',
        '&:hover': {
          '& .delete-form-field, & .drag-handle, & .add-subtitle, & .delete-subtitle': {
            opacity: 1,
          }
        },
      }}>
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

        {/* Title Editor */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{
            position: 'relative',
            '& .ql-toolbar': {
              // ... existing toolbar styles ...
            },
            '& .ql-container': {
              border: 'none',
              '& p': {  // Add this
                margin: 0,
                lineHeight: '1.5',
              }
            },
            '& .ql-editor': {
              padding: '0',  // Changed from '8px 0'
              fontSize: '1.5rem',
              fontWeight: 'bold',
              minHeight: '2em',  // Add this
              '&.ql-blank::before': {
                color: '#999',
                fontStyle: 'normal',
                left: 0,
                right: 0,
                top: 0,  // Add this
              },
              '& p': {  // Add these specific text formatting fixes
                margin: 0,
                padding: 0,
                '& span': {
                  display: 'inline',
                  lineHeight: 'inherit',
                },
                '& u, & s, & strong, & em': {
                  display: 'inline',
                  position: 'relative',
                  padding: '0 1px',  // Small padding to prevent clipping
                },
              }
            }
          }}>
            <ReactQuill
              ref={editorRef}
              value={item.question}
              onChange={(content) => {
                console.log('📝 Title Change:', {
                  fieldId: formFieldId,
                  content
                });
                onTitleChange(formFieldId, content);
              }}
              onFocus={handleFocus}
              modules={{
                toolbar: false,
                keyboard: {
                  bindings: {
                    tab: false,
                  }
                }
              }}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '4px',
              }}
              preserveWhitespace={true}
              placeholder="Enter title"
            />
          </Box>
        </Box>

        {/* Subtitles */}
        {item.options?.map((option: Option) => (
          <Box
            key={option.formFieldsOptionId}
            sx={{
              position: 'relative',
              mb: 2,
              '&:hover .delete-subtitle': {
                opacity: 1,
              },
              '& .ql-editor': {  // Add these styles for subtitles
                padding: '0',
                '& p': {
                  margin: 0,
                  lineHeight: '1.5',
                  '& span': {
                    display: 'inline',
                    lineHeight: 'inherit',
                  },
                  '& u, & s, & strong, & em': {
                    display: 'inline',
                    position: 'relative',
                    padding: '0 1px',
                  },
                }
              }
            }}
          >
            <Box>
              <ReactQuill
                value={option.option}
                onChange={(content) => onSubtitleChange(formFieldId, option.formFieldsOptionId, content)}
                onFocus={() => onEditorFocus(formFieldId, `subtitle-${option.formFieldsOptionId}`, null)}
                modules={{
                  toolbar: false,
                  keyboard: {
                    bindings: {
                      tab: false,
                    }
                  }
                }}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '4px',
                }}
                placeholder="Enter subtitle"
              />
            </Box>
            <IconButton
              className="delete-subtitle"
              onClick={() => onDeleteSubtitle(formFieldId, option.formFieldsOptionId)}
              sx={{
                position: 'absolute',
                right: '-36px',
                top: '50%',
                transform: 'translateY(-50%)',
                opacity: 0,
                transition: 'opacity 0.2s',
                padding: '4px',
                '&:hover': {
                  color: '#f44336',
                }
              }}
              size="small"
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {/* Add Subtitle Button */}
        <Button
          className="add-subtitle"
          startIcon={<AddIcon />}
          onClick={() => onAddSubtitle(formFieldId)}
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
          Add Subtitle
        </Button>
      </Box>
    </Box>
  );
};

export default TitleContent; 
