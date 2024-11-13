import React, { useState } from 'react';
import { Box, Typography, List, ListItemButton, ListItemText, Stack, TextField } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import SubjectIcon from '@mui/icons-material/Subject';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableChartIcon from '@mui/icons-material/TableChart';

const Sidebar: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [elements, setElements] = useState([
    { id: '1', category: 'Layout Elements', items: [{ label: 'Sections', icon: <ViewModuleIcon fontSize="small" /> }, { label: 'Tables', icon: <TableChartIcon fontSize="small" /> }] },
    { id: '2', category: 'Text Elements', items: [{ label: 'Single Line', icon: <TextFieldsIcon fontSize="small" /> }, { label: 'Multiline', icon: <SubjectIcon fontSize="small" /> }, { label: 'Number', icon: <KeyboardIcon fontSize="small" /> }, { label: 'Rich Text', icon: <FormatBoldIcon fontSize="small" /> }] },
    { id: '3', category: 'Date Elements', items: [{ label: 'Date', icon: <EventNoteIcon fontSize="small" /> }, { label: 'Date & Time', icon: <EventNoteIcon fontSize="small" /> }] },
    { id: '4', category: 'Multi Elements', items: [{ label: 'Yes/No', icon: <CheckBoxIcon fontSize="small" /> }, { label: 'Checkbox', icon: <CheckBoxIcon fontSize="small" /> }] },
  ]);

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCategoryIndex = elements.findIndex((category) => category.id === source.droppableId);
    const destinationCategoryIndex = elements.findIndex((category) => category.id === destination.droppableId);

    const sourceItems = Array.from(elements[sourceCategoryIndex].items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceCategoryIndex === destinationCategoryIndex) {
      sourceItems.splice(destination.index, 0, movedItem);
      const newElements = [...elements];
      newElements[sourceCategoryIndex].items = sourceItems;
      setElements(newElements);
    } else {
      const destinationItems = Array.from(elements[destinationCategoryIndex].items);
      destinationItems.splice(destination.index, 0, movedItem);

      const newElements = [...elements];
      newElements[sourceCategoryIndex].items = sourceItems;
      newElements[destinationCategoryIndex].items = destinationItems;
      setElements(newElements);
    }
  };

  const filteredElements = elements.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.label.toLowerCase().includes(searchText.toLowerCase())
    ),
  })).filter(category => category.items.length > 0);

  return (
    <Box
      sx={{
        width: { xs: '100%', sm: '250px' },
        backgroundColor: '#F9F9F9',
        color: '#333',
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        boxSizing: 'border-box',
        paddingLeft: '20px',
        paddingRight: '20px'
      }}
    >
      {/* Header with Close Icon and Title in a Single Row */}
      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <HighlightOffIcon fontSize="large" />
        <Typography variant="h5" fontWeight="bold">
          Form.M
        </Typography>
      </Stack>

      {/* Compact Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search Components"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        sx={{
          marginTop: 2,
          marginBottom: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            height: '30px',
            fontSize: '0.75rem',
          },
          width: '80%', // Adjust width here (e.g., 80% of the container width)
          maxWidth: '300px', // Optional: set a max width if needed
        }}
        fullWidth
      />

      {/* Draggable Components with Uniform Padding and Margin */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {filteredElements.map((category) => (
          <Box key={category.id} sx={{ mb: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {category.category}
            </Typography>
            <Droppable droppableId={category.id} direction="horizontal">
              {(provided) => (
                <List ref={provided.innerRef} {...provided.droppableProps} sx={{ mt: 0.5, padding: 0 }}>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {category.items.map((item, index) => (
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
                              minWidth: '80px',
                            }}
                          >
                            {/* Conditional Gaps above "Multiline", "Number", and "Rich Text" */}
                            {(item.label === "Multiline" || item.label === "Number" || item.label === "Rich Text") && (
                              <Box sx={{ height: '8px' }} />  // Adjust gap size as needed
                            )}
                            <ListItemButton
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '4px',
                                p: 0.5,
                                m: 0.5,
                                backgroundColor: '#fff',
                                boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
                                minWidth: '80px',
                                height: '35px',  // Reduce height for the Single Line and other items
                              }}
                            >
                              {React.cloneElement(item.icon, { fontSize: 'small' })} {/* Adjust icon size */}
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
                    ))}
                  </Stack>
                  {provided.placeholder}
                </List>
              )}
            </Droppable>
          </Box>
        ))}
      </DragDropContext>
    </Box>
  );
};

export default Sidebar;