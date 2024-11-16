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
} from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CircleIcon from '@mui/icons-material/Circle';

const pageSizes = {
  A4: { width: 210 * 3.7795, height: 297 * 3.7795 },
  A3: { width: 297 * 3.7795, height: 420 * 3.7795 },
  Custom: { width: 800, height: 600 },
};

const initialItems = [
  { id: "1", x: 0, y: 0, width: 150, height: 150, color: "#a8d8ea" },
  { id: "2", x: 0, y: 0, width: 150, height: 150, color: "#a8d8ea" },
];

const EditPageSettings: React.FC = () => {
  const [pageSize, setPageSize] = useState<string>('Letter');
  const [orientation, setOrientation] = useState<string>('Portrait');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("A4");
  const [gridPadding, setGridPadding] = useState({ top: 10, bottom: 10, left: 10, right: 10 });


  const [items, setItems] = useState(initialItems);
  const rndContainerRef = useRef(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 210 * 3.7795, height: 297 * 3.7795 });

  const [imageData, setImageData] = useState<{ [key: string]: string }>({
    Background: '',
    Footer: '',
    Header: ''
  });

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
    setSelectedSize(event.target.value);
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
              x: (data.x / gridSize.width) * 100,
              y: (data.y / gridSize.height) * 100,
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
              width: ref.offsetWidth,
              height: ref.offsetHeight,
              x: (position.x / gridSize.width) * 100,
              y: (position.y / gridSize.height) * 100,
            }
          : item
      )
    );
  };

  const handlePrint = async () => {
    if (rndContainerRef.current) {
      const canvas = await html2canvas(rndContainerRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdfWidth = (pageSizes[selectedSize].width * 72) / 96;
      const pdfHeight = (pageSizes[selectedSize].height * 72) / 96;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [pdfWidth, pdfHeight],
      });

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dataurlnewwindow.pdf");
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedSize(event.target.value as string);
  };
  
  const handleOrientationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setOrientation(event.target.value as string);
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
    width: `${70}vw`,
    height: `${70*(gridSize.height/gridSize.width)}vw`,
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
    boxSizing: "border-box", // Ensure padding does not affect overall size
  }}
>
  <div ref={rndContainerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
    {items.map((item) => (
      <Rnd
        key={item.id}
        size={{ width: item.width, height: item.height }}
        position={{
          x: (item.x / 100) * gridSize.width,
          y: (item.y / 100) * gridSize.height,
        }}
        onDragStop={(e, data) => handleDragStop(item.id, e, data)}
        onResizeStop={(e, direction, ref, delta, position) =>
          handleResizeStop(item.id, e, direction, ref, delta, position)
        }
        minWidth={50}
        minHeight={50}
        bounds="parent"
        style={{
          backgroundColor: item.color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {item.id}
      </Rnd>
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
