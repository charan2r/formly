import React, { useState, useEffect, useRef } from 'react';
import { Box, Checkbox, IconButton, Button } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';
import axios from 'axios';

interface CheckboxContentProps {
  item: QuestionItem;
  formFieldId: string;
  onQuestionChange: (itemId: string, newContent: string) => void;
  onOptionChange: (itemId: string, optionId: string, newContent: string) => void;
  onDeleteOption: (itemId: string, optionId: string) => void;
  onAddOption: (itemId: string) => void;
}

interface Option {
  formFieldsOptionId: string;
  option: string;
  formFieldId: string;
}

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'align': [] }],
    ['clean']
  ],
};

const useDebounce = (callback: Function, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  return (...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

const CheckboxContent: React.FC<CheckboxContentProps> = ({
  item,
  formFieldId,
  onQuestionChange,
  onOptionChange,
  onDeleteOption,
  onAddOption,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<{[key: string]: string}>({});

  const debouncedUpdate = useDebounce(async (formFieldsOptionId: string, newContent: string) => {
    try {
      const response = await axios.patch(`http://localhost:3001/form-fields-options/update`, {
        optionId: formFieldsOptionId,
        option: newContent,
        formFieldId: formFieldId
      });

      if (response.data.success) {
        setPendingUpdates(prev => {
          const updated = { ...prev };
          delete updated[formFieldsOptionId];
          return updated;
        });
      }
    } catch (error) {
      console.error('Error updating option:', error);
      setOptions(prevOptions => 
        prevOptions.map(opt => 
          opt.formFieldsOptionId === formFieldsOptionId
            ? { ...opt, option: pendingUpdates[formFieldsOptionId] || opt.option }
            : opt
        )
      );
    }
  }, 1000);

  const handleOptionChange = (formFieldsOptionId: string, newContent: string) => {
    setOptions(prevOptions => 
      prevOptions.map(opt => 
        opt.formFieldsOptionId === formFieldsOptionId 
          ? { ...opt, option: newContent }
          : opt
      )
    );

    setPendingUpdates(prev => ({
      ...prev,
      [formFieldsOptionId]: newContent
    }));

    debouncedUpdate(formFieldsOptionId, newContent);
  };

  const handleDeleteOption = async (optionId: string) => {
    try {
      await onDeleteOption(formFieldId, optionId);
      setOptions(prevOptions => prevOptions.filter(opt => opt.formFieldsOptionId !== optionId));
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  const handleAddOption = async () => {
    await onAddOption(formFieldId);
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/form-fields-options`, {
          params: { formFieldId: formFieldId }
        });
        if (response.data.success) {
          const updatedOptions = response.data.data.map((opt: Option) => ({
            ...opt,
            option: pendingUpdates[opt.formFieldsOptionId] || opt.option
          }));
          setOptions(updatedOptions);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
    const intervalId = setInterval(fetchOptions, 2000);
    return () => clearInterval(intervalId);
  }, [formFieldId, pendingUpdates]);

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

      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 1.5,
        '&:hover .add-option': {
          opacity: 1,
        },
      }}>
        {options.map((option) => (
          <Box
            key={option.formFieldsOptionId}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              p: 1,
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              backgroundColor: '#ffffff',
              position: 'relative',
              '&:hover .delete-icon': {
                opacity: 1,
              },
            }}
          >
            <Checkbox
              disabled
              size="small"
              sx={{
                color: '#757575',
                '&.Mui-disabled': {
                  color: '#757575',
                },
              }}
            />
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
            }}>
              <ReactQuill
                key={`editor-${option.formFieldsOptionId}`}
                value={pendingUpdates[option.formFieldsOptionId] || option.option}
                onChange={(content) => handleOptionChange(option.formFieldsOptionId, content)}
                modules={quillModules}
                style={{
                  backgroundColor: '#ffffff',
                }}
              />
            </Box>
            <IconButton 
              className="delete-icon"
              size="small" 
              onClick={() => handleDeleteOption(option.formFieldsOptionId)}
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
        
        <Button
          className="add-option"
          startIcon={<AddIcon />}
          onClick={handleAddOption}
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
  );
};

export default CheckboxContent; 