import React, {useState, useEffect, useRef} from 'react';
import { Box, Typography, Button, Radio, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';
import axios from 'axios';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface QuestionContentProps {
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

// Add a debounce utility
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

const QuestionContent: React.FC<QuestionContentProps> = ({
  item,
  formFieldId,
  onQuestionChange,
  onOptionChange,
  onDeleteOption,
  onAddOption,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [pendingUpdates, setPendingUpdates] = useState<{[key: string]: string}>({});

  // Debounced update function
  const debouncedUpdate = useDebounce(async (formFieldsOptionId: string, newContent: string) => {
    try {
      const response = await axios.patch(`http://localhost:3001/form-fields-options/update`, {
        optionId: formFieldsOptionId,
        option: newContent,
        formFieldId: formFieldId
      });

      if (response.data.success) {
        // Clear pending update after successful save
        setPendingUpdates(prev => {
          const updated = { ...prev };
          delete updated[formFieldsOptionId];
          return updated;
        });
      }
    } catch (error) {
      console.error('Error updating option:', error);
      // Revert the option content on error
      setOptions(prevOptions => 
        prevOptions.map(opt => 
          opt.formFieldsOptionId === formFieldsOptionId
            ? { ...opt, option: pendingUpdates[formFieldsOptionId] || opt.option }
            : opt
        )
      );
    }
  }, 1000); // 1 second delay

  // Modified handleOptionChange
  const handleOptionChange = (formFieldsOptionId: string, newContent: string) => {
    // Update local state immediately for responsive UI
    setOptions(prevOptions => 
      prevOptions.map(opt => 
        opt.formFieldsOptionId === formFieldsOptionId 
          ? { ...opt, option: newContent }
          : opt
      )
    );

    // Store the pending update
    setPendingUpdates(prev => ({
      ...prev,
      [formFieldsOptionId]: newContent
    }));

    // Trigger debounced update
    debouncedUpdate(formFieldsOptionId, newContent);
  };

  // Modified useEffect to handle polling
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/form-fields-options`, {
          params: { formFieldId: formFieldId }
        });
        if (response.data.success) {
          // Merge server data with pending updates
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

  // Add local handler for adding option
  const handleAddOption = async () => {
    try {
      const response = await axios.post(`http://localhost:3001/form-fields-options/create`, {
        option: 'New Option',
        formFieldId: formFieldId
      });

      if (response.data.success) {
        console.log(response.data.data);
        // Update local state with the new option
        setOptions(prevOptions => [...prevOptions, response.data.data]);
      }
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  // Add a handler for deleting options
  const handleDeleteOption = async (formFieldsOptionId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3001/form-fields-options/delete`, {
        params: { formFieldsOptionId: formFieldsOptionId }
      });

      if (response.data.success) {
        // Update local state by removing the deleted option
        setOptions(prevOptions => 
          prevOptions.filter(opt => opt.formFieldsOptionId !== formFieldsOptionId)
        );
      }
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  // Add delete handler
  const handleDeleteFormField = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/form-fields/delete?id=${formFieldId}`);
      if (response.data.success) {
        // The parent component will handle removal from UI through polling
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
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          position: 'relative',
          '&:hover .delete-form-field': {  // Add this hover effect
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
            opacity: 0,  // Start with opacity 0
            transition: 'opacity 0.2s ease',  // Smooth transition
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
                '&:hover .delete-icon': {  // Show delete icon on hover
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
                  opacity: 0,  // Hidden by default
                  transition: 'opacity 0.2s ease',  // Smooth transition
                  '&:hover': { 
                    color: '#f44336'  // Red color on hover
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
    </Box>
  );
};

export default QuestionContent; 