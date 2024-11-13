import React, { useState, useEffect } from 'react';
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

const EditPageSettings: React.FC = () => {
  const [pageSize, setPageSize] = useState<string>('Letter');
  const [orientation, setOrientation] = useState<string>('Portrait');
  const [backgroundColor, setBackgroundColor] = useState<string>('#4F46E5');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
      setBackgroundColor(savedSettings.backgroundColor || '#4F46E5');
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

  const handlePageSizeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPageSize(event.target.value as string);
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

  // Dynamic page styles based on size and orientation
  const getPageStyles = () => {
    const pageDimensions = {
      Letter: { width: 816, height: 1056 },
      A4: { width: 794, height: 1123 },
      Legal: { width: 816, height: 1344 },
    };
    const { width, height } = pageDimensions[pageSize];
    return {
      width: orientation === 'Portrait' ? width : height,
      height: orientation === 'Portrait' ? height : width,
    };
  };

  return (
    <Container maxWidth="lg">
      <Box display="flex">
        {/* Main Form Section */}
        <Paper
          elevation={4}
          sx={{
            padding: '50px', // Increased padding for Paper component
            margin: '16px',
            width: showSidebar ? '70%' : '100%',
            backgroundColor: backgroundColor,
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'width 0.3s ease',
            paddingLeft: '70px', // Added more padding to the left side
            ...getPageStyles(), // Apply dynamic styles here
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
                  <IconButton onClick={() => console.log('Back arrow clicked')}>
                    <CircleIcon style={{ color: 'black' }} />
                  </IconButton>
                  <ArrowForward style={{ color: 'black' }} />
                  <Typography variant="body2" color="textSecondary">
                    Atlas Corp. → Edit Template
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
              <form>
                <TextField label="First Name" fullWidth margin="normal" />
                <TextField label="Employee ID" fullWidth margin="normal" />
                <Typography variant="body1" gutterBottom>
                  Assigned Delegates
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <FormControl>
                    <Button variant="outlined">Yes</Button>
                  </FormControl>
                  <FormControl>
                    <Button variant="outlined">No</Button>
                  </FormControl>
                </Box>
                <Box sx={{ border: '1px dashed #ccc', mt: 2, height: 100 }} />
              </form>
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
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              height: '100vh',
              boxSizing: 'border-box',
              marginLeft: '50px',
              justifyContent: 'space-between',
              transition: 'width 0.3s ease',
              paddingLeft: '2px', // Added more padding to the left side of the sidebar
              paddingRight: '2px',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>Page Settings</Typography>

            {/* Page Size Selection */}
            <FormControl fullWidth variant="outlined" margin="dense" sx={{ marginBottom: '20px' }}>
              <InputLabel>Page Size</InputLabel>
              <Select value={pageSize} onChange={handlePageSizeChange} label="Page Size">
                <MenuItem value="Letter">Letter</MenuItem>
                <MenuItem value="A4">A4</MenuItem>
                <MenuItem value="Legal">Legal</MenuItem>
              </Select>
            </FormControl>

            {/* Margins Section */}
            <Typography variant="body1" sx={{ fontWeight: 'medium', marginBottom: '15px' }}>Margins</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: '20px' }}>
              {['Top', 'Bottom', 'Right', 'Left'].map((side) => (
                <Button
                  key={side}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: '8px', textTransform: 'capitalize' }}
                >
                  {side.toLowerCase()}
                </Button>
              ))}
            </Box>

            {/* Orientation Selection */}
            <FormControl fullWidth variant="outlined" margin="dense" sx={{ marginBottom: '20px' }}>
              <InputLabel>Orientation</InputLabel>
              <Select value={orientation} onChange={handleOrientationChange} label="Orientation">
                <MenuItem value="Portrait">Portrait</MenuItem>
                <MenuItem value="Landscape">Landscape</MenuItem>
              </Select>
            </FormControl>

            {/* Images Section */}
            <Typography variant="body1" sx={{ fontWeight: 'medium', marginBottom: '15px' }}>Images</Typography>
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
      </Box>
    </Container>
  );
};

export default EditPageSettings;
