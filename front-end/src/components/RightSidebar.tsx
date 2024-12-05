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
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useTemplate } from '../context/TemplateContext';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';

const pageSizes = {
  A4: { width: 210 * 3.7795, height: 297 * 3.7795 },
  A3: { width: 297 * 3.7795, height: 420 * 3.7795 },
  Custom: { width: 800, height: 600 },
};

const initialItems = [
  { id: "1", x: 0, y: 0, width: 150, height: 150, color: "#a8d8ea" },
  { id: "2", x: 0, y: 0, width: 150, height: 150, color: "#a8d8ea",type: 'title' },
];



interface TemplateData {
  formTemplateId: string;
  name: string;
  description: string;
  backgroundColor: string;
  pageSize: string;
  marginTop: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  version: number;
  status: string;
  categoryId: string;
}

// Add this interface for the form field type
interface FormField {
  fieldId: string;
  question: string;
  type: string;
  color: string;
  width: string;
  height: string;
  x: string;
  y: string;
  formTemplateId: string;
  // Add other fields as needed
}

const EditPageSettings: React.FC = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState<string>('Letter');
  const [orientation, setOrientation] = useState<string>('Portrait');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState("A4");
  const [gridPadding, setGridPadding] = useState({ top: 10, bottom: 10, left: 10, right: 10 });
  const { formTemplateId } = useParams();
  const { setFormTemplateId } = useTemplate();


  const [items, setItems] = useState<any[]>([]);
  const rndContainerRef = useRef(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ width: 210 * 3.7795, height: 297 * 3.7795 });

  const [imageData, setImageData] = useState<{ [key: string]: string }>({
    Background: '',
    Footer: '',
    Header: ''
  });

  useEffect(() => {
    if (formTemplateId) {
      setFormTemplateId(formTemplateId);
    }
  }, [formTemplateId, setFormTemplateId]);


  // Add new state to track initial page size for scaling
  const [initialPageSize] = useState(selectedSize);

  // Get the formTemplateId from URL parameters
  // const { formTemplateId } = useParams();
  
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);

  // Add new state for template name and description
  const [templateName, setTemplateName] = useState('Employee Survey');
  const [templateDescription, setTemplateDescription] = useState('Add a description');

  // Add these state initializations with templateData values
  const [pageSettings, setPageSettings] = useState({
    pageSize: 'A4',
    margins: {
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    }
  });

  // Add state to track if settings have changed
  const [hasChanges, setHasChanges] = useState(false);

  // Add these new states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempDescription, setTempDescription] = useState('');
  const [templateId, setTemplateId] = useState('');

  // Add this state near your other useState declarations
  const [borderStyle, setBorderStyle] = useState({
    width: 1,
    style: 'solid',
    color: '#e0e0e0'
  });

  // Add these state declarations at the top
  const [appearanceSettings, setAppearanceSettings] = useState({
    border: {
      width: 1,
      style: 'solid',
      color: '#e0e0e0',
      radius: 12
    },
    boxShadow: {
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      color: 'rgba(0, 0, 0, 0.1)',
      enabled: true
    },
    background: {
      color: '#ffffff',
      opacity: 100
    }
  });

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await api.get(`/form-templates/details?id=${formTemplateId}`);
        
        if (response.data.status === 'success') {
          const template = response.data.data;
          console.log("temasd awd Adplate", template);
          setTemplateData(template);
          setTemplateId(template.formTemplateId);
          // Initialize states with template data
          setBackgroundColor(template.backgroundColor || '#ffffff');
          setSelectedSize(template.pageSize || 'A4');
          setGridPadding({
            top: parseInt(template.marginTop) || 10,
            bottom: parseInt(template.marginBottom) || 10,
            left: parseInt(template.marginLeft) || 10,
            right: parseInt(template.marginRight) || 10
          });
          setTemplateName(template.name);
          setTemplateDescription(template.description);
        }
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    if (formTemplateId) {
      fetchTemplateData();
    }
  }, [formTemplateId]);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem('pageSettings') || '{}');
    if (savedSettings) {
      setPageSize(savedSettings.pageSize || 'Letter');
      setOrientation(savedSettings.orientation || 'Portrait');
      setBackgroundColor(savedSettings.backgroundColor || '#ffffff');
      setShowSidebar(savedSettings.showSidebar || false);
    }
  }, []);

  // Modify the hasChanges useEffect to include name and description changes
  useEffect(() => {
    if (templateData) {
      const hasSettingsChanged = 
        backgroundColor !== templateData.backgroundColor ||
        selectedSize !== templateData.pageSize ||
        gridPadding.top !== parseInt(templateData.marginTop) ||
        gridPadding.bottom !== parseInt(templateData.marginBottom) ||
        gridPadding.left !== parseInt(templateData.marginLeft) ||
        gridPadding.right !== parseInt(templateData.marginRight) ||
        templateName !== templateData.name ||  // Add name check
        templateDescription !== templateData.description;  // Add description check

      setHasChanges(hasSettingsChanged);
    }
  }, [
    backgroundColor, 
    selectedSize, 
    gridPadding, 
    templateData, 
    templateName,     // Add to dependency array
    templateDescription  // Add to dependency array
  ]);

  // Modify the name and description handlers to use the main save button
  const handleNameDoubleClick = () => {
    setIsEditingName(true);
    setTempName(templateName);
  };

  const handleDescriptionDoubleClick = () => {
    setIsEditingDescription(true);
    setTempDescription(templateDescription);
  };

  // Update these handlers to just update the state without saving
  const handleNameChange = () => {
    setTemplateName(tempName);
    setIsEditingName(false);
  };

  const handleDescriptionChange = () => {
    setTemplateDescription(tempDescription);
    setIsEditingDescription(false);
  };

  // Update the TextField components to use the new handlers
  {isEditingName ? (
    <TextField
      fullWidth
      value={tempName}
      onChange={(e) => setTempName(e.target.value)}
      onBlur={handleNameChange}  // Changed from handleNameSave
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleNameChange();  // Changed from handleNameSave
        }
      }}
      autoFocus
      variant="outlined"
      size="small"
      sx={{
        marginBottom: '8px',
        '& .MuiOutlinedInput-root': {
          fontSize: '1.5rem',
          fontWeight: 'bold',
          backgroundColor: '#fff',
          borderRadius: '8px',
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#999',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#333',
            borderWidth: '2px',
          },
        },
        '& .MuiOutlinedInput-input': {
          padding: '8px 12px',
        }
      }}
    />
  ) : (
    <Typography 
      variant="h5" 
      fontWeight="bold"
      onDoubleClick={handleNameDoubleClick}
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        },
        padding: '4px 8px',
      }}
    >
      {templateName}
    </Typography>
  )}

  {isEditingDescription ? (
    <TextField
      fullWidth
      value={tempDescription}
      onChange={(e) => setTempDescription(e.target.value)}
      onBlur={handleDescriptionChange}  // Changed from handleDescriptionSave
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          handleDescriptionChange();  // Changed from handleDescriptionSave
        }
      }}
      autoFocus
      variant="outlined"
      size="small"
      multiline
      sx={{
        marginTop: '-5px',
        marginBottom: '5px',
        '& .MuiOutlinedInput-root': {
          fontSize: '0.875rem',
          color: 'text.secondary',
          backgroundColor: '#fff',
          borderRadius: '6px',
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#999',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#333',
            borderWidth: '2px',
          },
        },
        '& .MuiOutlinedInput-input': {
          padding: '6px 10px',
        }
      }}
    />
  ) : (
    <Typography 
      variant="body2" 
      color="textSecondary" 
      marginBottom="5px" 
      marginTop="-10px"
      onDoubleClick={handleDescriptionDoubleClick}
      sx={{ 
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '4px',
          transition: 'background-color 0.2s'
        },
        padding: '4px 8px',
      }}
    >
      {templateDescription}
    </Typography>
  )}

  // Update the main save button to include name and description in the save
  const handleSave = async () => {
    try {
      if (!formTemplateId || !hasChanges) return;

      const updateData = {
        name: templateName,
        description: templateDescription,
        backgroundColor: backgroundColor,
        pageSize: selectedSize,
        marginTop: gridPadding.top.toString(),
        marginBottom: gridPadding.bottom.toString(),
        marginLeft: gridPadding.left.toString(),
        marginRight: gridPadding.right.toString(),
        version: templateData?.version,
        status: templateData?.status,
        categoryId: templateData?.categoryId
      };

      const response = await api.patch(
        `/form-templates/edit?id=${formTemplateId}`,
        updateData
      );

      if (response.data.status === 'success') {
        setHasChanges(false);
        // Fetch updated data after successful save
        const updatedResponse = await api.get(`/form-templates/details?id=${formTemplateId}`);
        if (updatedResponse.data.status === 'success') {
          setTemplateData(updatedResponse.data.data);
        }
        console.log('Template updated successfully');
      }
    } catch (error) {
      console.error('Error updating template:', error);
    }
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

  // Add new useEffect to fetch form fields
  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        if (!formTemplateId) return;

        const response = await api.get(`/form-fields`, {
          params: { formTemplateId: formTemplateId }
        });

        if (response.data.success) {
          // Transform backend data to match your items structure
          const transformedItems = response.data.data.map((field: FormField) => ({
            id: field.fieldId
            ,
            x: parseFloat(field.x) || 0,
            y: parseFloat(field.y) || 0,
            width: parseFloat(field.width) || 150,
            height: parseFloat(field.height) || 150,
            color: field.color || "#a8d8ea",
            type: field.type || 'question',
            question: field.question || "How satisfied are you with the company's professional development opportunities?",
           
          }));
          console.log("transformedItems", transformedItems);

          setItems(transformedItems);
        }
      } catch (error) {
        console.error('Error fetching form fields:', error);
        // Fallback to initial items if fetch fails
        setItems(initialItems.map(item => ({
          ...item,
          question: "How satisfied are you with the company's professional development opportunities?",
         
        })));
      }
    };

    fetchFormFields();
  }, [formTemplateId]);

  const handlePageSizeChange = async (event: SelectChangeEvent) => {
    const newSize = event.target.value;
    const oldSize = selectedSize;

    try {
      if (formTemplateId) {
        // First update the template in database
        await api.patch(`/form-templates/edit?id=${formTemplateId}`, {
          pageSize: newSize,
          // Include other fields to prevent them from being lost
          backgroundColor,
          marginTop: gridPadding.top.toString(),
          marginBottom: gridPadding.bottom.toString(),
          marginLeft: gridPadding.left.toString(),
          marginRight: gridPadding.right.toString(),
          version: templateData?.version,
          status: templateData?.status,
          categoryId: templateData?.categoryId,
          name: templateName,
          description: templateDescription
        });

        // Then update local states
        setSelectedSize(newSize);
        setGridSize({
          width: pageSizes[newSize].width,
          height: pageSizes[newSize].height
        });

        // Fix the scaling calculation
        // When going from A4 to A3, we want items to appear smaller (divide by scale)
        // When going from A3 to A4, we want items to appear larger (multiply by scale)
        const scaleX = pageSizes[oldSize].width / pageSizes[newSize].width; // Inverted ratio
        const scaleY = pageSizes[oldSize].height / pageSizes[newSize].height; // Inverted ratio

        const updatedItems = items.map(item => ({
          ...item,
          width: item.width * scaleX,  // Now scales correctly
          height: item.height * scaleY, // Now scales correctly
          x: item.x * scaleX,          // Now scales correctly
          y: item.y * scaleY           // Now scales correctly
        }));

        // Update form fields in database
        await Promise.all(updatedItems.map(item => 
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

        setItems(updatedItems);
      }
    } catch (error) {
      console.error('Error updating page size:', error);
      // Revert changes on error
      setSelectedSize(oldSize);
      setGridSize({
        width: pageSizes[oldSize].width,
        height: pageSizes[oldSize].height
      });
    }
  };

  // Also update gridSize when component mounts or selectedSize changes
  useEffect(() => {
    setGridSize({
      width: pageSizes[selectedSize].width,
      height: pageSizes[selectedSize].height
    });
  }, [selectedSize]);

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
    return "100vw";
  };

  // Update handleQuestionChange to include all fields
  const handleQuestionChange = async (itemId: string, newContent: string) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    try {
      const updateData = {
        question: newContent,
        x: item.x.toString(),
        y: item.y.toString(),
        width: item.width.toString(),
        height: item.height.toString(),
        type: item.type,
        color: item.color,
        options: JSON.stringify(item.options)
      };

      await api.patch(`/form-fields/update?id=${itemId}`, updateData);

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, question: newContent } : item
        )
      );
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  

  // Update handleOptionChange to include all fields
  const handleOptionChange = async (itemId: string, optionId: number, newContent: string) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    try {
      const updatedOptions = item.options.map(opt =>
        opt.id === optionId ? { ...opt, text: newContent } : opt
      );

      const updateData = {
        options: JSON.stringify(updatedOptions),
        question: item.question,
        x: item.x.toString(),
        y: item.y.toString(),
        width: item.width.toString(),
        height: item.height.toString(),
        type: item.type,
        color: item.color
      };

      await api.patch(`/form-fields/update?id=${itemId}`, updateData);

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? {
                ...item,
                options: updatedOptions
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating option:', error);
    }
  };

  // Helper function to create update data
  const createUpdateData = (item: any, partialUpdate: any) => {
    return {
      
      x: item.x.toString(),
      y: item.y.toString(),
      width: item.width.toString(),
      height: item.height.toString(),
      question: item.question,
      type: item.type,
      color: item.color,
      options: JSON.stringify(item.options),
      ...partialUpdate
    };
  };

  // Update handleAddOption to include all fields
  const handleAddOption = async (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    try {
      const newOption = {
        id: item.options.length + 1,
        text: 'New Option',
        value: item.options.length + 1
      };
      const updatedOptions = [...item.options, newOption];

      const updateData = createUpdateData(item, {
        options: JSON.stringify(updatedOptions)
      });

      await api.patch(`/form-fields/update?id=${itemId}`, updateData);

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? {
                ...item,
                options: updatedOptions
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  // Update handleDeleteOption to include all fields
  const handleDeleteOption = async (itemId: string, optionId: number) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return;

    try {
      const updatedOptions = item.options.filter(opt => opt.id !== optionId);

      const updateData = createUpdateData(item, {
        options: JSON.stringify(updatedOptions)
      });

      await api.patch(`/form-fields/update?id=${itemId}`, updateData);

      setItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId
            ? {
                ...item,
                options: updatedOptions
              }
            : item
        )
      );
    } catch (error) {
      console.error('Error deleting option:', error);
    }
  };

  // Optional: Add a pulsing animation to the save button when there are changes
  <Button
    variant="contained"
    size="small"
    sx={{
      backgroundColor: hasChanges ? 'black' : '#666',
      color: 'white',
      borderRadius: '20px',
      paddingX: '15px',
      '&:hover': {
        backgroundColor: hasChanges ? '#333' : '#777',
      },
      animation: hasChanges ? 'pulse 2s infinite' : 'none',
      '@keyframes pulse': {
        '0%': {
          boxShadow: '0 0 0 0 rgba(0,0,0, 0.4)',
        },
        '70%': {
          boxShadow: '0 0 0 10px rgba(0,0,0, 0)',
        },
        '100%': {
          boxShadow: '0 0 0 0 rgba(0,0,0, 0)',
        },
      },
    }}
    onClick={handleSave}
    disabled={!hasChanges}
  >
    Save
  </Button>

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
                <IconButton 
            sx={{ 
              backgroundColor: '#f5f5f5',
              color: 'black',
              '&:hover': {
                backgroundColor: '#e0e0e0',
              },
            }}
            onClick={() => navigate(-1)}
          >
            <KeyboardBackspaceRoundedIcon sx={{ fontSize: 22 }} />
          </IconButton>
                  <IconButton onClick={() => console.log('Back arrow clicked')}>
                    <CircleIcon style={{ color: 'black' }} />
                  </IconButton>
                  <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
                  <Typography variant="body2" color="textSecondary">
                    Edit Template 
                  </Typography>
                  <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
                  <Typography variant="body2" color="textSecondary">
                {templateData?.name || 'Template'}
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
                        backgroundColor: hasChanges ? 'black' : '#666',
                        color: 'white',
                        borderRadius: '20px',
                        paddingX: '15px',
                        '&:hover': {
                          backgroundColor: hasChanges ? '#333' : '#777',
                        },
                        animation: hasChanges ? 'pulse 2s infinite' : 'none',
                        '@keyframes pulse': {
                          '0%': {
                            boxShadow: '0 0 0 0 rgba(0,0,0, 0.4)',
                          },
                          '70%': {
                            boxShadow: '0 0 0 10px rgba(0,0,0, 0)',
                          },
                          '100%': {
                            boxShadow: '0 0 0 0 rgba(0,0,0, 0)',
                          },
                        },
                      }}
                      onClick={handleSave}
                      disabled={!hasChanges}
                    >
                      Save
                    </Button>
                  </Box>
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {isEditingName ? (
                    <TextField
                      fullWidth
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      onBlur={handleNameChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleNameChange();
                        }
                      }}
                      autoFocus
                      variant="outlined"
                      size="small"
                      sx={{
                        marginBottom: '8px',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '1.5rem',
                          fontWeight: 'bold',
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#999',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#333',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '8px 12px',
                        }
                      }}
                    />
                  ) : (
                    <Typography 
                      variant="h5" 
                      fontWeight="bold"
                      onDoubleClick={handleNameDoubleClick}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        },
                        padding: '4px 8px',
                      }}
                    >
                      {templateName}
                    </Typography>
                  )}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  marginBottom="5px" 
                  marginTop="-10px"
                >
                  {isEditingDescription ? (
                    <TextField
                      fullWidth
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      onBlur={handleDescriptionChange}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleDescriptionChange();
                        }
                      }}
                      autoFocus
                      variant="outlined"
                      size="small"
                      multiline
                      sx={{
                        marginTop: '-5px',
                        marginBottom: '5px',
                        '& .MuiOutlinedInput-root': {
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          backgroundColor: '#fff',
                          borderRadius: '6px',
                          '& fieldset': {
                            borderColor: '#e0e0e0',
                          },
                          '&:hover fieldset': {
                            borderColor: '#999',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#333',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiOutlinedInput-input': {
                          padding: '6px 10px',
                        }
                      }}
                    />
                  ) : (
                    <Typography 
                      variant="body2" 
                      color="textSecondary" 
                      marginBottom="5px" 
                      marginTop="-10px"
                      onDoubleClick={handleDescriptionDoubleClick}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          borderRadius: '4px',
                          transition: 'background-color 0.2s'
                        },
                        padding: '4px 8px',
                      }}
                    >
                      {templateDescription}
                    </Typography>
                  )}
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
    maxWidth: "100%",
    marginRight: 0,
  }}
>
  <div 
    ref={rndContainerRef} 
    style={{ 
      position: "relative", 
      width: "100%", 
      height: "100%",
      transition: "all 0.3s ease",
      marginRight: 0,
    }}
  >
    <DraggableQuestion
      formTemplateId={formTemplateId!}
      items={items}
      gridSize={gridSize}
      selectedSize={selectedSize}
      pageSizes={pageSizes}
      borderStyle={borderStyle}
      onQuestionChange={handleQuestionChange}
      onOptionChange={handleOptionChange}
      onDeleteOption={handleDeleteOption}
      onAddOption={handleAddOption}
      appearanceSettings={appearanceSettings}
    />
  </div>
</div>

            </Grid>
          </Grid>
        </Paper>

        {/* Sidebar Section */}
        {showSidebar && (
          <Box
            sx={{
              position: 'fixed',
              right: 0,
              top: 0,
              width: '250px',
              backgroundColor: '#F9F9F9',
              color: '#333',
              height: '100vh',
              boxSizing: 'border-box',
              padding: '20px',
              boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              overflowY: 'auto',
              transition: 'transform 0.3s ease',
              transform: showSidebar ? 'translateX(0)' : 'translateX(100%)',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#bdbdbd',
                borderRadius: '4px',
                '&:hover': {
                  background: '#9e9e9e',
                },
              },
            }}
          >
            {/* Header with toggle button */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Page Settings
              </Typography>
              <IconButton
                onClick={toggleSidebar}
                sx={{
                  padding: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <ArrowForward sx={{ 
                  transform: 'rotate(180deg)',
                  transition: 'transform 0.3s ease',
                }} />
              </IconButton>
            </Box>

            {/* Page Size Selection */}
            <FormControl fullWidth variant="outlined" margin="dense" sx={{ marginBottom: '20px' }}>
              <InputLabel>Page Size</InputLabel>
              <Select value={selectedSize} onChange={handlePageSizeChange} label="Page Size">
                <MenuItem value="A4">A4</MenuItem>
                <MenuItem value="A3">A3</MenuItem>
                <MenuItem value="Custom">Custom</MenuItem>
              </Select>
            </FormControl>

            {/* Grid Padding Controls */}
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
                    }}
                  />
                </Box>
              ))}
            </Box>

            

            {/* Background Color Picker */}
            <Typography variant="body1" sx={{ fontWeight: 'medium', marginBottom: '15px' }}>
              Background Color
            </Typography>
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

            <Typography variant="body1" sx={{ fontWeight: 'medium', marginTop: '20px', marginBottom: '15px' }}>
              Form Fields Border
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: '#fff', p: 2, borderRadius: 1, boxShadow: 1 }}>
              {/* Border Width */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Border Width</Typography>
                <TextField
                  type="number"
                  size="small"
                  value={borderStyle.width}
                  onChange={(e) => setBorderStyle(prev => ({
                    ...prev,
                    width: Number(e.target.value)
                  }))}
                  inputProps={{ min: 0, max: 10 }}
                  fullWidth
                />
              </Box>

              {/* Border Style */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Border Style</Typography>
                <Select
                  size="small"
                  value={borderStyle.style}
                  onChange={(e) => setBorderStyle(prev => ({
                    ...prev,
                    style: e.target.value
                  }))}
                  fullWidth
                >
                  <MenuItem value="solid">Solid</MenuItem>
                  <MenuItem value="dashed">Dashed</MenuItem>
                  <MenuItem value="dotted">Dotted</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                </Select>
              </Box>

              {/* Border Color */}
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>Border Color</Typography>
                <input
                  type="color"
                  value={borderStyle.color}
                  onChange={(e) => setBorderStyle(prev => ({
                    ...prev,
                    color: e.target.value
                  }))}
                  style={{ width: '100%', height: '30px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                />
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                Field Appearance
              </Typography>

              {/* Border Settings */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                  Border
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      type="number"
                      label="Width"
                      value={appearanceSettings.border.width}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        border: {
                          ...prev.border,
                          width: Number(e.target.value)
                        }
                      }))}
                      InputProps={{ inputProps: { min: 0, max: 10 } }}
                    />
                    <TextField
                      size="small"
                      type="number"
                      label="Radius"
                      value={appearanceSettings.border.radius}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        border: {
                          ...prev.border,
                          radius: Number(e.target.value)
                        }
                      }))}
                      InputProps={{ inputProps: { min: 0, max: 50 } }}
                    />
                  </Box>
                  <Select
                    size="small"
                    value={appearanceSettings.border.style}
                    onChange={(e) => setAppearanceSettings(prev => ({
                      ...prev,
                      border: {
                        ...prev.border,
                        style: e.target.value
                      }
                    }))}
                    fullWidth
                  >
                    <MenuItem value="solid">Solid</MenuItem>
                    <MenuItem value="dashed">Dashed</MenuItem>
                    <MenuItem value="dotted">Dotted</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                  </Select>
                  <Box>
                    <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                      Border Color
                    </Typography>
                    <input
                      type="color"
                      value={appearanceSettings.border.color}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        border: {
                          ...prev.border,
                          color: e.target.value
                        }
                      }))}
                      style={{ width: '100%', height: '30px', padding: '0', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Box Shadow Settings */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                  Box Shadow
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      type="number"
                      label="X"
                      value={appearanceSettings.boxShadow.x}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        boxShadow: {
                          ...prev.boxShadow,
                          x: Number(e.target.value)
                        }
                      }))}
                    />
                    <TextField
                      size="small"
                      type="number"
                      label="Y"
                      value={appearanceSettings.boxShadow.y}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        boxShadow: {
                          ...prev.boxShadow,
                          y: Number(e.target.value)
                        }
                      }))}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      type="number"
                      label="Blur"
                      value={appearanceSettings.boxShadow.blur}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        boxShadow: {
                          ...prev.boxShadow,
                          blur: Number(e.target.value)
                        }
                      }))}
                      InputProps={{ inputProps: { min: 0 } }}
                    />
                    <TextField
                      size="small"
                      type="number"
                      label="Spread"
                      value={appearanceSettings.boxShadow.spread}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        boxShadow: {
                          ...prev.boxShadow,
                          spread: Number(e.target.value)
                        }
                      }))}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                      Shadow Color & Opacity
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <input
                        type="color"
                        value={appearanceSettings.boxShadow.color}
                        onChange={(e) => setAppearanceSettings(prev => ({
                          ...prev,
                          boxShadow: {
                            ...prev.boxShadow,
                            color: e.target.value
                          }
                        }))}
                        style={{ width: '50px', height: '30px', padding: '0', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                      <TextField
                        size="small"
                        type="number"
                        label="Opacity %"
                        value={appearanceSettings.background.opacity}
                        onChange={(e) => setAppearanceSettings(prev => ({
                          ...prev,
                          background: {
                            ...prev.background,
                            opacity: Number(e.target.value)
                          }
                        }))}
                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Background Settings */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
                  Background
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                      Background Color
                    </Typography>
                    <input
                      type="color"
                      value={appearanceSettings.background.color}
                      onChange={(e) => setAppearanceSettings(prev => ({
                        ...prev,
                        background: {
                          ...prev.background,
                          color: e.target.value
                        }
                      }))}
                      style={{ width: '100%', height: '30px', padding: '0', border: '1px solid #ddd', borderRadius: '4px' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Main toggle button (visible when sidebar is closed) */}
        {!showSidebar && (
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: 'fixed',
              right: '20px',
              top: '20px',
              backgroundColor: '#F9F9F9',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              '&:hover': {
                backgroundColor: '#fff',
              },
            }}
          >
            <ArrowForward />
          </IconButton>
        )}
      </>
  );
};

export default EditPageSettings;
