import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { Rnd } from 'react-rnd';
import QuestionContent from './questions/QuestionContent';
import CheckboxContent from './questions/CheckboxContent';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';
import TitleContent from './questions/TitleContent';
import { TitleItem } from '../types/questions';
import api from '../utils/axios';
import { Droppable } from 'react-beautiful-dnd';
import './DraggableQuestion.css';
import SingleLineQuestion from './questions/SingleLineQuestion';
import MultiLineQuestion from './questions/MultiLineQuestion';
import LabelQuestion from './questions/LabelQuestion';
import DateContent from './questions/DateContent';
import DateTimeContent from './questions/DateTimeContent';
import YesNoContent from './questions/YesNoContent';
import { useTemplate } from '../context/TemplateContext';
import './DraggableQuestion.css';
import SectionContent from './questions/SectionContent';

interface DraggableQuestionProps {
  formTemplateId: string;
  items: any[];
  gridSize: { width: number; height: number };
  selectedSize: string;
  pageSizes: { [key: string]: { width: number; height: number } };
  onQuestionChange: (itemId: string, newContent: string) => void;
  onOptionChange: (itemId: string, optionId: number, newContent: string) => void;
  onDeleteOption: (itemId: string, optionId: number) => void;
  onAddOption: (itemId: string) => void;
  isViewMode?: boolean;
  fieldStyle?: {
    border: {
      width: number;
      style: string;
      color: string;
      radius: number;
    };
    shadow: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
    };
    background: {
      color: string;
      opacity: number;
    };
  };
  borderStyle?: {
    width: number;
    style: string;
    color: string;
  };
  appearanceSettings?: {
    border: {
      width: number;
      style: string;
      color: string;
      radius: number;
    };
    boxShadow: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string;
      enabled: boolean;
    };
    background: {
      color: string;
      opacity: number;
    };
  };
  onPageSizeChange?: (newSize: string) => void;
  activeFieldId: string | null;
  activeEditorId: string | null;
  onEditorFocus: (fieldId: string, editorId: string, quill: any) => void;
  onAlignmentChange: (itemId: string, alignment: string) => void;
}

interface PageDimensions {
  width: number;
  height: number;
}

const calculateScale = (selectedSize: string, pageSizes: { [key: string]: { width: number; height: number } }) => {
  const baseSize = pageSizes['A4'];
  const targetSize = pageSizes[selectedSize];
  return baseSize.width / targetSize.width;
};

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  formTemplateId,
  items,
  gridSize,
  selectedSize,
  pageSizes,
  onQuestionChange,
  onOptionChange,
  onDeleteOption,
  onAddOption,
  isViewMode,
  fieldStyle,
  borderStyle,
  appearanceSettings,
  onPageSizeChange,
  activeFieldId,
  activeEditorId,
  onEditorFocus,
  onAlignmentChange,
}) => {
  const [formFields, setFormFields] = useState<QuestionItem[]>(items);
  const [isDragging, setIsDragging] = useState(false);

  // useEffect for periodic updates
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        if (!formTemplateId) return;
        
        const response = await api.get(`/form-fields`, {
          params: { formTemplateId }
        });
        
        if (response.data.success) {
          const transformedFields = response.data.data.map((field: any) => ({
            id: field.fieldId,
            x: parseFloat(field.x) || 0,
            y: parseFloat(field.y) || 0,
            width: parseFloat(field.width) || 300,
            height: parseFloat(field.height) || 200,
            color: field.color || "#a8d8ea",
            type: field.type || 'question',
            question: field.question || "New Question",
            options: field.options ? JSON.parse(field.options) : [],
            borderWidth: field.borderWidth || '1px',
            borderStyle: field.borderStyle || 'solid',
            borderColor: field.borderColor || '#e0e0e0',
          }));
          setFormFields(transformedFields);
        }
      } catch (error) {
        console.error('Error fetching form fields:', error);
      }
    };

    // Initial fetch
    fetchFormFields();

    // Set up polling interval (every 1 second)
    const intervalId = setInterval(fetchFormFields, 1000);

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(intervalId);
  }, [formTemplateId]); // Only re-run if formTemplateId changes

  // Update formFields when items prop changes
  useEffect(() => {
    if (items && items.length > 0) {
      setFormFields(items);
    }
  }, [items]);

  const handleDragStop = async (e: any, data: any, item: QuestionItem) => {
    setIsDragging(false);
    
    // Get the current page dimensions
    const currentPageSize = pageSizes[selectedSize];
    
    // Direct conversion from pixels to document units based on current page size
    const newX = (data.x / gridSize.width) * currentPageSize.width;
    const newY = (data.y / gridSize.height) * currentPageSize.height;

    setFormFields(prevFields => prevFields.map(field => 
      field.id === item.id 
        ? { 
            ...field, 
            x: newX,
            y: newY
          }
        : field
    ));

    const updateData = {
      x: newX.toString(),
      y: newY.toString(),
      width: item.width.toString(),
      height: item.height.toString(),
      question: item.question,
      type: item.type,
      color: item.color,
    };

    await updateFieldPosition(item.id, updateData);
  };

  const handleResizeStop = async (
    e: any, 
    direction: any, 
    ref: any, 
    delta: any, 
    position: any, 
    item: QuestionItem
  ) => {
    // Get the current page dimensions
    const currentPageSize = pageSizes[selectedSize];
    
    // Direct conversion from pixels to document units based on current page size
    const newWidth = (ref.offsetWidth / gridSize.width) * currentPageSize.width;
    const newHeight = (ref.offsetHeight / gridSize.height) * currentPageSize.height;
    const newX = (position.x / gridSize.width) * currentPageSize.width;
    const newY = (position.y / gridSize.height) * currentPageSize.height;
    console.log(newWidth, newHeight, newX, newY);

    setFormFields(prevFields => prevFields.map(field => 
      field.id === item.id 
        ? { 
            ...field, 
            width: newWidth,
            height: newHeight,
            x: newX,
            y: newY
          }
        : field
    ));

    const updateData = {
      width: newWidth.toString(),
      height: newHeight.toString(),
      x: newX.toString(),
      y: newY.toString(),
      question: item.question,
      type: item.type,
      color: item.color,
    };

    await updateFieldPosition(item.id, updateData);
  };

  const updateFieldPosition = async (id: string, updateData: any) => {
    try {
      await api.patch(`/form-fields/update?id=${id}`, updateData);
      // Update local state after successful API call
      setFormFields(prevFields => prevFields.map(field => 
        field.id === id 
          ? { 
              ...field, 
              x: parseFloat(updateData.x),
              y: parseFloat(updateData.y),
              width: parseFloat(updateData.width),
              height: parseFloat(updateData.height)
            }
          : field
      ));
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };
  
  // Add this function to handle question content updates
  const handleQuestionUpdate = async (id: string, newContent: string) => {
    try {
      const updateData = {
        question: newContent,
        // Include other necessary fields to prevent them from being lost
        x: formFields.find(field => field.id === id)?.x.toString(),
        y: formFields.find(field => field.id === id)?.y.toString(),
        width: formFields.find(field => field.id === id)?.width.toString(),
        height: formFields.find(field => field.id === id)?.height.toString(),
        type: formFields.find(field => field.id === id)?.type,
        color: formFields.find(field => field.id === id)?.color,
      };

      await api.patch(`/form-fields/update?id=${id}`, updateData);
      
      // Update local state after successful API call
      setFormFields(prevFields => prevFields.map(field => 
        field.id === id 
          ? { 
              ...field, 
              question: newContent
            }
          : field
      ));
    } catch (error) {
      console.error('Error updating question content:', error);
    }
  };

  const handleOptionChange = async (itemId: string, optionId: string, newContent: string) => {
    try {
      await api.patch(`/form-fields-options/update`, {
        optionId,
        option: newContent,
        formFieldId: itemId
      });
    } catch (error) {
      console.error('Error updating option:', error);
    }
  };

  const handleDeleteOption = async (itemId: string, optionId: string) => {
    try {
      await api.delete(`/delete?optionId=${optionId}`);
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  const handleAddOption = async (itemId: string) => {
    try {
      await api.post(`/form-fields-options/create`, {
        option: 'New Option',
        formFieldId: itemId
      });
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  const renderQuestionComponent = (item: QuestionItem) => {
    const commonProps = {
      item,
      formFieldId: item.id,
      onQuestionChange: handleQuestionUpdate,
      onEditorFocus,
      activeFieldId,
      activeEditorId,
    };

    switch (item.type) {
      case 'section':
        return (
          <SectionContent
            {...commonProps}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': ['', 'center', 'right'] }],
                  ['clean']
                ],
              },
              keyboard: {
                bindings: {
                  tab: false,
                }
              }
            }}
          />
        );

      case 'title':
        return (
          <TitleContent
            {...commonProps}
            onTitleChange={handleQuestionUpdate}
            onSubtitleChange={handleOptionChange}
            onDeleteSubtitle={handleDeleteOption}
            onAddSubtitle={handleAddOption}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': ['', 'center', 'right'] }],
                  ['clean']
                ],
              },
              keyboard: {
                bindings: {
                  tab: false,
                }
              }
            }}
          />
        );

      case 'date':
        return (
          <DateContent
            {...commonProps}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': ['', 'center', 'right'] }],
                  ['clean']
                ],
              },
              keyboard: {
                bindings: {
                  tab: false,
                }
              }
            }}
          />
        );

      case 'datetime':
        return (
          <DateTimeContent
            {...commonProps}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': ['', 'center', 'right'] }],
                  ['clean']
                ],
              },
              keyboard: {
                bindings: {
                  tab: false,
                }
              }
            }}
          />
        );

      case 'yes-no':
        return <YesNoContent {...commonProps} />;
      
      case 'checkbox':
        return (
          <CheckboxContent
            {...commonProps}
            onOptionChange={handleOptionChange}
            onDeleteOption={handleDeleteOption}
            onAddOption={handleAddOption}
          />
        );
      
      case 'multiline':
        return (
          <MultiLineQuestion
            {...commonProps}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': ['', 'center', 'right'] }],
                  ['clean']
                ],
              },
              keyboard: {
                bindings: {
                  tab: false,
                }
              }
            }}
          />
        );
      
      case 'single-line':
        return (
          <SingleLineQuestion
            {...commonProps}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': ['', 'center', 'right'] }],
                  ['clean']
                ],
              },
              keyboard: {
                bindings: {
                  tab: false,
                }
              }
            }}
          />
        );
      
      case 'label':
        return (
          <LabelQuestion
            {...commonProps}
            modules={{
              toolbar: {
                container: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': ['', 'center', 'right'] }],
                  ['clean']
                ],
              },
              keyboard: {
                bindings: {
                  tab: false,
                }
              }
            }}
          />
        );
      
      default:
        return (
          <QuestionContent
            {...commonProps}
            onOptionChange={handleOptionChange}
            onDeleteOption={handleDeleteOption}
            onAddOption={handleAddOption}
          />
        );
    }
  };
  const handlePageSizeChange = async (newSize: string, oldSize: string) => {
    try {
      const oldPageSize = pageSizes[oldSize];
      const newPageSize = pageSizes[newSize];

      // Calculate scale factors for width and height
      const scaleX = newPageSize.width / oldPageSize.width;
      const scaleY = newPageSize.height / oldPageSize.height;

      const updatedFields = formFields.map(item => {
        // Scale positions and dimensions proportionally
        const newPosition = {
          x: item.x * scaleX,
          y: item.y * scaleY,
          width: item.width / scaleX,
          height: item.height / scaleY
        };

        // Ensure the item stays within page bounds
        const boundedPosition = {
          x: Math.max(0, Math.min(newPosition.x, newPageSize.width - newPosition.width)),
          y: Math.max(0, Math.min(newPosition.y, newPageSize.height - newPosition.height)),
          width: newPosition.width,
          height: newPosition.height
        };

        return {
          ...item,
          ...boundedPosition
        };
      });

      // Update form fields in the database
      await Promise.all(updatedFields.map(item => 
        api.patch(`/form-fields/update?id=${item.id}`, {
          width: item.width.toString(),
          height: item.height.toString(),
          x: item.x.toString(),
          y: item.y.toString(),
          question: item.question,
          type: item.type,
          color: item.color,
        })
      ));

      setFormFields(updatedFields);
    } catch (error) {
      console.error('Error updating field positions:', error);
    }
  };

  // Add effect to handle page size changes
  useEffect(() => {
    console.log('Page size changed to:', selectedSize);
    if (selectedSize) {
      const previousSize = localStorage.getItem('previousPageSize') || 'A4';
      handlePageSizeChange(selectedSize, previousSize);
      localStorage.setItem('previousPageSize', selectedSize);
    }
  }, [selectedSize]);

  return (
    <Droppable droppableId="rnd-container">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          {formFields.map((item) => (
            <Rnd
              key={item.id}
              style={{
                backgroundColor: appearanceSettings?.background.color || '#ffffff',
                opacity: (appearanceSettings?.background.opacity || 100) / 100,
                boxShadow: appearanceSettings?.boxShadow.enabled 
                  ? `${appearanceSettings.boxShadow.x}px ${appearanceSettings.boxShadow.y}px ${appearanceSettings.boxShadow.blur}px ${appearanceSettings.boxShadow.spread}px ${appearanceSettings.boxShadow.color}`
                  : 'none',
                borderRadius: `${appearanceSettings?.border.radius || 12}px`,
                border: `${appearanceSettings?.border.width || 1}px ${appearanceSettings?.border.style || 'solid'} ${appearanceSettings?.border.color || '#e0e0e0'}`,
                overflow: 'hidden',
                pointerEvents: isViewMode ? 'none' : 'auto',
              }}
              className="draggable-question"
              size={{
                width: (item.width / pageSizes[selectedSize].width) * gridSize.width,
                height: (item.height / pageSizes[selectedSize].height) * gridSize.height
              }}
              position={{
                x: (item.x / pageSizes[selectedSize].width) * gridSize.width,
                y: (item.y / pageSizes[selectedSize].height) * gridSize.height
              }}
              onDragStart={handleDragStart}
              onDragStop={(e, data) => handleDragStop(e, data, item)}
              onResizeStop={(e, direction, ref, delta, position) => {
                handleResizeStop(e, direction, ref, delta, position, item);
              }}
              bounds="parent"
              dragHandleClassName="drag-handle"
            >
              <Box sx={{ width: '100%', height: '100%' }}>
                {renderQuestionComponent(item)}
              </Box>
            </Rnd>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default DraggableQuestion; 