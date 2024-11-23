import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  Container,
  Paper,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Radio,
} from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DraggableQuestion from './DraggableQuestion';

const pageSizes = {
  A4: { width: 210 * 3.7795, height: 297 * 3.7795 },
  A3: { width: 297 * 3.7795, height: 420 * 3.7795 },
  Custom: { width: 800, height: 600 },
};

const initialItems = [
  { id: "1", x: 0, y: 0, width: 150, height: 150, color: "#a8d8ea" },
  { id: "2", x: 0, y: 0, width: 150, height: 150, color: "#a8d8ea",type: 'title' },
];

const getRandomPosition = (maxWidth: number, maxHeight: number, itemWidth: number, itemHeight: number) => {
  return {
    x: Math.random() * (maxWidth - itemWidth),
    y: Math.random() * (maxHeight - itemHeight)
  };
};

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

const EditPageSettings: React.FC = () => {
  const [pageSize, setPageSize] = useState<string>('Letter');
  const [orientation, setOrientation] = useState<string>('Portrait');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("A4");
  const [gridPadding, setGridPadding] = useState({ top: 10, bottom: 10, left: 10, right: 10 });


  const [items, setItems] = useState(initialItems.map(item => ({
    ...item,
    question: "How satisfied are you with the company's professional development opportunities?",
    options: [
      { id: 1, text: 'Very Satisfied', value: 5 },
      { id: 2, text: 'Satisfied', value: 4 },
      { id: 3, text: 'Neutral', value: 3 },
      { id: 4, text: 'Dissatisfied', value: 2 },
      { id: 5, text: 'Very Dissatisfied', value: 1 }
    ]
  })));
  const rndContainerRef = useRef(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 210 * 3.7795, height: 297 * 3.7795 });

  const [imageData, setImageData] = useState<{ [key: string]: string }>({
    Background: '',
    Footer: '',
    Header: ''
  });

  // Add new state to track initial page size for scaling
  const [initialPageSize] = useState(selectedSize);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('pageSettings') || '{}');
    if (savedSettings) {
      setPageSize(savedSettings.pageSize || 'Letter');
      setOrientation(savedSettings.orientation || 'Portrait');
      setBackgroundColor(savedSettings.backgroundColor || '#ffffff');
      setShowSidebar(savedSettings.showSidebar || false);
    }
  }, []);

  const handleSave = () => {
    const settings = {
      pageSize,
      orientation,
      backgroundColor,
      showSidebar,
    };
    localStorage.setItem('pageSettings', JSON.stringify(settings));
    console.log('Settings saved');
  };

  const handleSizeChange = (event) => {
    const newSize = event.target.value;
    const oldSize = selectedSize;
    
    setItems(prevItems => prevItems.map(item => {
      // Calculate distances from right and bottom edges
      const distanceFromRight = pageSizes[oldSize].width - (item.x + item.width);
      const distanceFromBottom = pageSizes[oldSize].height - (item.y + item.height);
      
      // If item is closer to right edge than left, maintain right distance
      const newX = distanceFromRight < item.x
        ? pageSizes[newSize].width - distanceFromRight - item.width
        : (item.x / pageSizes[oldSize].width) * pageSizes[newSize].width;

      // If item is closer to bottom edge than top, maintain bottom distance
      const newY = distanceFromBottom < item.y
        ? pageSizes[newSize].height - distanceFromBottom - item.height
        : (item.y / pageSizes[oldSize].height) * pageSizes[newSize].height;
      
      return {
        ...item,
        x: newX,
        y: newY,
        width: (item.width / pageSizes[oldSize].width) * pageSizes[newSize].width,
        height: (item.height / pageSizes[oldSize].height) * pageSizes[newSize].height,
      };
    }));
    
    setSelectedSize(newSize);
  };

  const calculateGridSize = () => {
    if (paperRef.current) {
      const { width, height } = pageSizes[selectedSize];
      const isPortrait = orientation === "Portrait";
      const effectiveWidth = isPortrait ? width : height;
      const effectiveHeight = isPortrait ? height : width;
  
      const parentWidth = paperRef.current.offsetWidth;
      console.log(paperRef.current.offsetWidth)
      const ratio = effectiveHeight / effectiveWidth;
  
      const gridWidth = Math.min(parentWidth, effectiveWidth); // Use parent width as max
      const gridHeight = gridWidth * ratio; // Maintain aspect ratio
      console.log(gridHeight/gridWidth)
  
      setGridSize({ width: gridWidth, height: gridHeight });
    }
  };

  useEffect(() => {
    calculateGridSize();
  }, [selectedSize, orientation]);

  const handleDragStop = (id, e, data) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              x: (data.x / gridSize.width) * pageSizes[selectedSize].width,
              y: (data.y / gridSize.height) * pageSizes[selectedSize].height,
            }
          : item
      )
    );
  };

  const handleResizeStop = (id, e, direction, ref, delta, position) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              width: (ref.offsetWidth / gridSize.width) * pageSizes[selectedSize].width,
              height: (ref.offsetHeight / gridSize.height) * pageSizes[selectedSize].height,
              x: (position.x / gridSize.width) * pageSizes[selectedSize].width,
              y: (position.y / gridSize.height) * pageSizes[selectedSize].height,
            }
          : item
      )
    );
  };



  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSize(event.target.value as string);
  };


  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const handleImageClick = (image: string) => {
    // Trigger file input change when the circle is clicked
    document.getElementById(`${image}-upload`)?.click();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, label: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData((prevData) => ({
          ...prevData,
          [label]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGridPaddingChange = (side: string, value: number) => {
    setGridPadding((prevPadding) => ({
      ...prevPadding,
      [side]: value,
    }));
  };

  const getContainerWidth = () => {
    return showSidebar ? '55vw' : '70vw';
  };

  const handleQuestionChange = (itemId: string, newContent: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, question: newContent } : item
      )
    );
  };

  const handleOptionChange = (itemId: string, optionId: number, newContent: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              options: item.options.map(opt =>
                opt.id === optionId ? { ...opt, text: newContent } : opt
              )
            }
          : item
      )
    );
  };

  const handleAddOption = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              options: [
                ...item.options,
                {
                  id: item.options.length + 1,
                  text: 'New Option',
                  value: item.options.length + 1
                }
              ]
            }
          : item
      )
    );
  };

  const handleDeleteOption = (itemId: string, optionId: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? {
              ...item,
              options: item.options.filter(opt => opt.id !== optionId)
            }
          : item
      )
    );
  };

  return (
      <>
        {/* Main Form Section */}
        
        <Paper
          elevation={1}
          ref={paperRef}
          sx={{
            padding: '50px', // Increased padding for Paper component
            margin: '4px',
            marginTop: '25px',
            borderRadius: 3,
            overflow: 'auto',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column" gap={2} marginBottom={'3%'}>
                <Box display="flex" alignItems="center" gap={1}>
                  <IconButton onClick={() => console.log('Back arrow clicked')}>
                    <CircleIcon style={{ color: 'black' }} />
                  </IconButton>
                  <ArrowForward style={{ color: 'black' }} />
                  <Typography variant="body2" color="textSecondary">
                    Atlas Corp. 
                  </Typography>
                  <ArrowForward style={{ color: 'black' }} />
                  <Typography variant="body2" color="textSecondary">
                    Edit Template
                  </Typography>
                  <Box marginLeft="auto" display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        color: 'black',
                        borderColor: '#333',
                        borderWidth: 2,
                        borderRadius: '20px',
                        paddingX: '15px',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          borderColor: '#000',
                        },
                      }}
                      onClick={toggleSidebar}
                    >
                      Settings
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        borderRadius: '20px',
                        paddingX: '15px',
                        '&:hover': {
                          backgroundColor: '#333',
                        },
                      }}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold">Employee Survey</Typography>
                <Typography variant="body2" color="textSecondary" marginBottom="5px" marginTop="-10px">
                  Add a description
                </Typography>
              </Box>

             <div
  style={{
    width: getContainerWidth(),
    height: `${(getContainerWidth().replace('vw', '') as any) * (gridSize.height/gridSize.width)}vw`,
    position: "relative",
    border: "1px solid #ccc",
    borderRadius: '15px',
    overflow: "auto",
    backgroundColor: backgroundColor,
    transition: "all 0.3s ease",
    paddingTop: gridPadding.top,
    paddingBottom: gridPadding.bottom,
    paddingLeft: gridPadding.left,
    paddingRight: gridPadding.right,
    boxSizing: "border-box",
  }}
>
  <div 
    ref={rndContainerRef} 
    style={{ 
      position: "relative", 
      width: "100%", 
      height: "100%",
      transition: "all 0.3s ease"
    }}
  >
    {items.map((item) => (
      <DraggableQuestion
        key={item.id}
        item={item}
        gridSize={gridSize}
        selectedSize={selectedSize}
        pageSizes={pageSizes}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        onQuestionChange={handleQuestionChange}
        onOptionChange={handleOptionChange}
        onDeleteOption={handleDeleteOption}
        onAddOption={handleAddOption}
      />
    ))}
  </div>
</div>

            </Grid>
          </Grid>
        </Paper>

        {/* Sidebar Section */}
        {showSidebar && (
          <Box
            sx={{
              width: { xs: '100%', sm: '250px' },
              backgroundColor: '#F9F9F9',
              color: '#333',
              // p: 4,
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              boxSizing: 'border-box',
              marginLeft: '2%',
              marginRight: '2%',
              justifyContent: 'space-between',
              marginTop: '5%'
              // transition: 'width 0.3s ease',
              // paddingLeft: '2px', // Added more padding to the left side of the sidebar
              // paddingRight: '2px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px',  }}>Page Settings</Typography>

            {/* Page Size Selection */}
            <FormControl fullWidth variant="outlined" margin="dense" sx={{ marginBottom: '20px' }}>
  <InputLabel>Page Size</InputLabel>
  <Select value={selectedSize} onChange={handlePageSizeChange} label="Page Size">
    <MenuItem value="A4">A4</MenuItem>
    <MenuItem value="A3">A3</MenuItem>
    <MenuItem value="Custom">Custom</MenuItem>
  </Select>
</FormControl>

<Typography 
  variant="body1" 
  sx={{ 
    fontWeight: 600, 
    marginBottom: 2, 
    fontSize: '16px', 
    color: '#333' 
  }}
>
  Grid Padding
</Typography>
<Box 
  sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    gap: 1, 
    padding: 1, 
    backgroundColor: '#f9f9f9', 
    borderRadius: '8px', 
    border: '1px solid #e0e0e0' 
  }}
>
  {['Top', 'Bottom', 'Left', 'Right'].map((side) => (
    <Box 
      key={side} 
      display="flex" 
      alignItems="center" 
      justifyContent="space-between" 
      sx={{ 
        paddingY: 0.5, 
        borderBottom: '1px solid #e0e0e0', 
        '&:last-child': { borderBottom: 'none' } 
      }}
    >
      <Typography 
        variant="body2" 
        sx={{ 
          color: '#555', 
          fontSize: '14px' 
        }}
      >
        {side}:
      </Typography>
      <TextField
        type="number"
        size="small"
        value={gridPadding[side.toLowerCase()]}
        onChange={(e) => handleGridPaddingChange(side.toLowerCase(), parseInt(e.target.value, 10))}
        inputProps={{ 
          min: 0, 
          style: { textAlign: 'center', fontSize: '14px' } 
        }}
        sx={{
          width: '100px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            fontSize: '14px',
            padding: '2px 6px',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#dcdcdc',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#999',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#333',
          },
        }}
      />
    </Box>
  ))}
</Box>





            {/* Images Section */}
            <Typography variant="body1" 
  sx={{ 
    fontWeight: 600, 
    marginBottom: 2, 
    marginTop: 2,
    fontSize: '16px', 
    color: '#333' 
  }}>Images</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2 }}>
              {['Background', 'Footer', 'Header'].map((label) => (
                <Box
                  key={label}
                  sx={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => handleImageClick(label)}
                >
                  <CircleIcon
                    sx={{
                      fontSize: 47,
                      color: imageData[label] ? '#000000' : '#ccc',
                      borderRadius: '50%',
                      border: imageData[label] ? '3px solid #000000' : 'none',
                      backgroundImage: imageData[label] ? `url(${imageData[label]})` : 'none',
                      backgroundSize: 'cover',
                    }}
                  />
                  <Typography variant="body2">{label}</Typography>
                  <input
                    id={`${label}-upload`}
                    type="file"
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, label)}
                  />
                </Box>
              ))}
            </Box>

            {/* Background Color Picker */}
            <Typography variant="body1" sx={{ fontWeight: 'medium', marginBottom: '15px' }}>Background Color</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, marginBottom: '20px' }}>
              <Box sx={{ width: '100%', backgroundColor: '#fff', boxShadow: 2, borderRadius: 1, p: 2 }}>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={handleBackgroundColorChange}
                  style={{ width: '100%', height: '30px', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </>
  );
};

export default EditPageSettings;
