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

// Sample Sidebar Data
const initialElements = [
  { id: '1', category: 'Layout Elements', items: [{ label: 'Sections', icon: <ViewModuleIcon /> }, { label: 'Tables', icon: <TableChartIcon /> }] },
  { id: '2', category: 'Text Elements', items: [{ label: 'Single Line', icon: <TextFieldsIcon /> }, { label: 'Multiline', icon: <SubjectIcon /> }, { label: 'Number', icon: <KeyboardIcon /> }, { label: 'Rich Text', icon: <FormatBoldIcon /> }] },
  { id: '3', category: 'Date Elements', items: [{ label: 'Date', icon: <EventNoteIcon /> }, { label: 'Date & Time', icon: <EventNoteIcon /> }] },
  { id: '4', category: 'Multi Elements', items: [{ label: 'Yes/No', icon: <CheckBoxIcon /> }, { label: 'Checkbox', icon: <CheckBoxIcon /> }] },
];

// Draggable Item Component
const DraggableItem = memo(({ item, index }) => (
  <Draggable key={item.label} draggableId={item.label} index={index}>
    {(provided) => (
      <Box
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '40px',
        }}
      >
        <ListItemButton
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '4px',
            p: 0.5,
            backgroundColor: '#fff',
            boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
            height: '35px',
          }}
        >
          {React.cloneElement(item.icon, { fontSize: 'small' })}
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontWeight: 'bold',
              textAlign: 'center',
              fontSize: '0.75rem',
            }}
          />
        </ListItemButton>
      </Box>
    )}
  </Draggable>
));

// Category Component
const Category = memo(({ category, filteredItems }) => (
  <Box key={category.id} sx={{ mb: 1 }}>
    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
      {category.category}
    </Typography>
    <Droppable droppableId={category.id} direction="horizontal">
      {(provided) => (
        <List ref={provided.innerRef} {...provided.droppableProps} sx={{ mt: 0.5, padding: 0 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {filteredItems.map((item, index) => (
              <DraggableItem key={item.label} item={item} index={index} />
            ))}
          </Stack>
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </Box>
));

const LeftSidebar: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [elements, setElements] = useState(initialElements);

  // Handle Drag End
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCategoryIndex = elements.findIndex((category) => category.id === source.droppableId);
    const destinationCategoryIndex = elements.findIndex((category) => category.id === destination.droppableId);

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
        width: { xs: '100%', sm: '20%' },
        backgroundColor: '#F9F9F9',
        color: '#333',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
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
          width: '80%',
          maxWidth: '300px',
        }}
        fullWidth
      />

      <DragDropContext onDragEnd={handleDragEnd}>
        {filteredElements.map((category) => (
          <Category key={category.id} category={category} filteredItems={category.items} />
        ))}
      </DragDropContext>
    </Box>
  );
};

export default LeftSidebar;
