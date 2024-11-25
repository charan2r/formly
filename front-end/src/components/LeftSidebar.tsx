import React, { useState, memo } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Stack, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SubjectIcon from '@mui/icons-material/Subject';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableChartIcon from '@mui/icons-material/TableChart';
import TitleIcon from '@mui/icons-material/Title';
import axios from 'axios';
import { useTemplate } from '../context/TemplateContext';

// Sample Sidebar Data
const initialElements = [
  { 
    id: '1', 
    category: 'Layout Elements', 
    items: [
      { label: 'Title', icon: <TitleIcon />, type: 'title' }, 
      { label: 'Sections', icon: <ViewModuleIcon />, type: 'section' }, 
      { label: 'Tables', icon: <TableChartIcon />, type: 'table' }
    ] 
  },
  { 
    id: '2', 
    category: 'Text Elements', 
    items: [
      { label: 'Single Line', icon: <TextFieldsIcon />, type: 'single-line' }, 
      { label: 'Multiline', icon: <SubjectIcon />, type: 'multiline' }, 
      { label: 'Number', icon: <KeyboardIcon />, type: 'number' }, 
      { label: 'Rich Text', icon: <FormatBoldIcon />, type: 'rich-text' }
    ] 
  },
  { 
    id: '3', 
    category: 'Date Elements', 
    items: [
      { label: 'Date', icon: <EventNoteIcon />, type: 'date' }, 
      { label: 'Date & Time', icon: <EventNoteIcon />, type: 'datetime' }
    ] 
  },
  { 
    id: '4', 
    category: 'Multi Elements', 
    items: [
      { label: 'Yes/No', icon: <CheckBoxIcon />, type: 'yes-no' }, 
      { label: 'Checkbox', icon: <CheckBoxIcon />, type: 'checkbox' }
    ] 
  },
];

// Draggable Item Component
const DraggableItem = memo(({ item, index }) => {
  const { formTemplateId } = useTemplate();

  const handleClick = async () => {
    if (!formTemplateId) {
      console.error('No template ID available');
      return;
    }

    try {
      const newField = {
        question: item.type === 'title' ? "New Title" : "New Question",
        type: item.type,
        x: "0",
        y: "0",
        width: "300",
        height: item.type === 'title' ? "150" : "200",
        color: "#a8d8ea",
        formTemplateId: formTemplateId,
        options: JSON.stringify(
          item.type === 'checkbox' || item.type === 'yes-no' 
            ? [
                { id: 1, text: "Option 1", value: 1 },
                { id: 2, text: "Option 2", value: 2 }
              ]
            : item.type === 'title' 
              ? [{ id: 1, text: "New Subtitle", value: 1 }]
              : []
        )
      };

      await axios.post('http://localhost:3001/form-fields/create', newField);
    } catch (error) {
      console.error('Error creating form field:', error);
    }
  };

  return (
    <Draggable key={item.type} draggableId={item.type} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          sx={{
            width: '100%',
            cursor: 'pointer',
          }}
        >
          <ListItemButton
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '8px',
              p: 1,
              backgroundColor: '#fff',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
              height: '40px',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <Box sx={{ mr: 2 }}>
              {React.cloneElement(item.icon, { 
                fontSize: 'small',
                sx: { color: '#666' }
              })}
            </Box>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontWeight: '500',
                fontSize: '0.85rem',
                color: '#333',
              }}
            />
          </ListItemButton>
        </Box>
      )}
    </Draggable>
  );
});

// Category Component
const Category = memo(({ category, filteredItems }) => (
  <Box 
    key={category.id} 
    sx={{ 
      mb: 3,
      width: '100%'
    }}
  >
    <Typography 
      variant="caption" 
      color="text.secondary" 
      sx={{ 
        ml: 1,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        fontSize: '0.7rem',
        display: 'block',
        mb: 1
      }}
    >
      {category.category}
    </Typography>
    <Droppable droppableId={category.id} direction="vertical">
      {(provided) => (
        <List 
          ref={provided.innerRef} 
          {...provided.droppableProps} 
          sx={{ 
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {filteredItems.map((item, index) => (
            <DraggableItem key={item.label} item={item} index={index} />
          ))}
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </Box>
));

const LeftSidebar: React.FC = () => {
  const { formTemplateId } = useTemplate();
  const [searchText, setSearchText] = useState('');
  const [elements, setElements] = useState(initialElements);

  const handleDragEnd = async (result: any) => {
    const { source, destination, draggableId: type } = result;
    
    if (!destination) return;

    // Check if dropping into RND container
    if (destination.droppableId === 'rnd-container') {
      if (!formTemplateId) {
        console.error('No template ID available');
        return;
      }

      try {
        const newField = {
          question: type === 'title' ? "New Title" : "New Question",
          type: type,
          x: "0",
          y: "0",
          width: "300",
          height: type === 'title' ? "150" : "200",
          color: "#a8d8ea",
          formTemplateId: formTemplateId,
          options: JSON.stringify(
            type === 'checkbox' || type === 'yes-no' 
              ? [
                  { id: 1, text: "Option 1", value: 1 },
                  { id: 2, text: "Option 2", value: 2 }
                ]
              : type === 'title'
                ? [{ id: 1, text: "New Subtitle", value: 1 }]
                : []
          )
        };

        await axios.post('http://localhost:3001/form-fields', newField);
        
        // Don't reorder items when dropping into RND container
        return;
      } catch (error) {
        console.error('Error creating form field:', error);
      }
    }

    // Only handle reordering if not dropping into RND container
    if (source.droppableId !== destination.droppableId) {
      return;
    }

    // Update category reordering logic to use new droppableId format
    const sourceCategoryId = source.droppableId.replace('category-', '');
    const destinationCategoryId = destination.droppableId.replace('category-', '');

    const sourceCategoryIndex = elements.findIndex((category) => category.id === sourceCategoryId);
    const destinationCategoryIndex = elements.findIndex((category) => category.id === destinationCategoryId);

    const sourceItems = Array.from(elements[sourceCategoryIndex].items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    const newElements = [...elements];
    if (sourceCategoryIndex === destinationCategoryIndex) {
      sourceItems.splice(destination.index, 0, movedItem);
      newElements[sourceCategoryIndex].items = sourceItems;
    } else {
      const destinationItems = Array.from(elements[destinationCategoryIndex].items);
      destinationItems.splice(destination.index, 0, movedItem);
      newElements[sourceCategoryIndex].items = sourceItems;
      newElements[destinationCategoryIndex].items = destinationItems;
    }

    setElements(newElements);
  };

  const filteredElements = elements
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '250px' },
        backgroundColor: '#F9F9F9',
        color: '#333',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        // borderRight: '1px solid #e0e0e0',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} mb={1} marginTop={'15%'}>
        <HighlightOffIcon fontSize="large" />
        <Typography variant="h5" fontWeight="bold">
          Form.M
        </Typography>
      </Stack>

      <TextField
        variant="outlined"
        placeholder="Search Components"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{
          mt: 2,
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            height: '30px',
            fontSize: '0.75rem',
          },
          width: '100%',
          maxWidth: '300px',
        }}
        fullWidth
      />

      {filteredElements.map((category) => (
        <Category key={category.id} category={category} filteredItems={category.items} />
      ))}
    </Box>
  );
};

export default LeftSidebar;
