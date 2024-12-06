import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../../types/questions';
import DragHandle from '../DragHandle';
import api from '../../utils/axios';

interface LabelQuestionProps {
  item: QuestionItem;
  formFieldId: string;
  onQuestionChange: (itemId: string, newContent: string) => void;
  onEditorFocus: (fieldId: string, editorId: string, quill: any) => void;
  activeFieldId: string | null;
  activeEditorId: string | null;
}

const LabelQuestion: React.FC<LabelQuestionProps> = ({
  item,
  formFieldId,
  onQuestionChange,
  onEditorFocus,
  activeFieldId,
  activeEditorId,
}) => {
  const questionEditorId = `question-${formFieldId}`;
  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (activeFieldId === formFieldId) {
      console.log('🎯 Active Editor in LabelQuestion:', {
        fieldId: formFieldId,
        editorId: activeEditorId,
        isQuestionEditor: activeEditorId === questionEditorId,
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
      onEditorFocus(formFieldId, questionEditorId, editorRef.current);
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
        '&:hover .delete-form-field': {
          opacity: 1,
        },
        '&:hover .drag-handle': {
          opacity: 1,
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

        <Box sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Box sx={{
            width: '100%',
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
            '& .ql-editor': {
              padding: '8px 0',
              fontSize: '1rem',
              lineHeight: 1.5,
              textAlign: 'center',
              '&.ql-blank::before': {
                color: '#999',
                fontStyle: 'normal',
                textAlign: 'center',
                left: 0,
                right: 0,
              }
            }
          }}>
            <ReactQuill
              ref={editorRef}
              value={item.question}
              onChange={(content) => {
                console.log('📝 Content Change:', {
                  fieldId: formFieldId,
                  content
                });
                onQuestionChange(formFieldId, content);
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
              placeholder="Enter label text"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LabelQuestion; 