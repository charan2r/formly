import React,{useState, useEffect} from 'react';
import { Rnd } from "react-rnd";
import { Box, Typography, Button, Radio, IconButton, TextField } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';
import QuestionContent from './QuestionContent';
import TitleContent from './TitleContent';
import { TitleItem } from '../types/questions';
import axios from 'axios'; // dont add this import ^ _ ^
import { Droppable } from 'react-beautiful-dnd';
import { useTemplate } from '../context/TemplateContext';
import './DraggableQuestion.css';


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
}

const calculateScale = (selectedSize: string, pageSizes: { [key: string]: { width: number; height: number } }) => {
  const baseSize = pageSizes['A4']; // Use A4 as reference size
  const currentSize = pageSizes[selectedSize];
  return Math.max(baseSize.width / currentSize.width, baseSize.height / currentSize.height);
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
}) => {
  const [formFields, setFormFields] = useState<QuestionItem[]>(items);
  const [isDragging, setIsDragging] = useState(false);

  // Add this new useEffect for periodic updates
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        if (!formTemplateId) return;
        
        const response = await axios.get(`http://localhost:3001/form-fields`, {
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
            options: field.options ? JSON.parse(field.options) : []
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
    const newX = (data.x / gridSize.width) * pageSizes[selectedSize].width;
    const newY = (data.y / gridSize.height) * pageSizes[selectedSize].height;

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
    const newWidth = (ref.offsetWidth / gridSize.width) * pageSizes[selectedSize].width;
    const newHeight = (ref.offsetHeight / gridSize.height) * pageSizes[selectedSize].height;
    const newX = (position.x / gridSize.width) * pageSizes[selectedSize].width;
    const newY = (position.y / gridSize.height) * pageSizes[selectedSize].height;

        // Update local state immediately
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
      await axios.patch(`http://localhost:3001/form-fields/update?id=${id}`, updateData);
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

      await axios.patch(`http://localhost:3001/form-fields/update?id=${id}`, updateData);
      
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
      await axios.patch(`http://localhost:3001/form-fields-options/update`, {
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
      await axios.delete(`http://localhost:3001/form-fields-options/delete?optionId=${optionId}`);
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  const handleAddOption = async (itemId: string) => {
    try {
      await axios.post(`http://localhost:3001/form-fields-options/create`, {
        option: 'New Option',
        formFieldId: itemId
      });
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  return (
    <Droppable droppableId="rnd-container">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ 
            width: '100%', 
            height: '100%', 
            position: 'relative',
          }}
        >
          {formFields.map((item) => (
            <Rnd
              key={item.id}
              style={{
                backgroundColor: '#ffffff',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                border: '1px solid #e0e0e0',
                overflow: 'hidden',
                pointerEvents: isViewMode ? 'none' : 'auto',
              }}
              className="draggable-question"
              size={{
                width: ((item.width / pageSizes[selectedSize].width) * gridSize.width) * calculateScale(selectedSize, pageSizes),
                height: ((item.height / pageSizes[selectedSize].height) * gridSize.height) * calculateScale(selectedSize, pageSizes)
              }}
              position={{
                x: ((item.x / pageSizes[selectedSize].width) * gridSize.width) * calculateScale(selectedSize, pageSizes),
                y: ((item.y / pageSizes[selectedSize].height) * gridSize.height) * calculateScale(selectedSize, pageSizes)
              }}
              enableResizing={!isViewMode}
              disableDragging={isViewMode}
              onDragStart={!isViewMode ? handleDragStart : undefined}
              onDragStop={!isViewMode ? (e, data) => {
                const scale = calculateScale(selectedSize, pageSizes);
                const newX = (data.x / (gridSize.width * scale)) * pageSizes[selectedSize].width;
                const newY = (data.y / (gridSize.height * scale)) * pageSizes[selectedSize].height;
                handleDragStop(e, { x: newX, y: newY }, item);
              } : undefined}
              onResizeStop={!isViewMode ? handleResizeStop : undefined}
              bounds="parent"
              dragHandleClassName={!isViewMode ? "drag-handle" : undefined}
            >
              <Box sx={{ 
                width: '100%',
                height: '100%',
              }}>
                {item.type === 'title' ? (
                  <TitleContent
                    item={item}
                    formFieldId={item.id}
                    onTitleChange={(itemId, newContent) => handleQuestionUpdate(itemId, newContent)}
                    onSubtitleChange={handleOptionChange}
                    onDeleteSubtitle={handleDeleteOption}
                    onAddSubtitle={handleAddOption}
                  />
                ) : (
                  <QuestionContent
                    item={item}
                    formFieldId={item.id}
                    onQuestionChange={handleQuestionUpdate}
                    onOptionChange={handleOptionChange}
                    onDeleteOption={handleDeleteOption}
                    onAddOption={handleAddOption}
                  />
                )}
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