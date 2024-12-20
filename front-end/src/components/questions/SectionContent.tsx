import React, { useRef, useEffect } from 'react';
import { Box, IconButton, Divider } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../../types/questions';
import DragHandle from '../DragHandle';
import api from '../../utils/axios';

interface SectionContentProps {
  item: QuestionItem;
  formFieldId: string;
  onQuestionChange: (itemId: string, newContent: string) => void;
  onEditorFocus: (fieldId: string, editorId: string, quill: any) => void;
  activeFieldId: string | null;
  activeEditorId: string | null;
}

const SectionContent: React.FC<SectionContentProps> = ({
  item,
  formFieldId,
  onQuestionChange,
  onEditorFocus,
  activeFieldId,
  activeEditorId,
}) => {
  const sectionEditorId = `section-${formFieldId}`;
  const editorRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (activeFieldId === formFieldId) {
      console.log('🎯 Active Editor in SectionContent:', {
        fieldId: formFieldId,
        editorId: activeEditorId,
        isSectionEditor: activeEditorId === sectionEditorId,
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
      onEditorFocus(formFieldId, sectionEditorId, editorRef.current);
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
          '& .delete-form-field, & .drag-handle': {
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

    
      </Box>
    </Box>
  );
};

export default SectionContent; 