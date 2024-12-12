import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import {
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import DraggableQuestion from './DraggableQuestion';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';


const pageSizes = {
  A4: { width: 210 * 3.7795, height: 297 * 3.7795 },
  A3: { width: 297 * 3.7795, height: 420 * 3.7795 },
  Custom: { width: 800, height: 600 },
};

const ViewTemplate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { templateId } = useParams();
  const [templateData, setTemplateData] = useState<any>(null);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState("A4");
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [gridSize, setGridSize] = useState({ width: 210 * 3.7795, height: 297 * 3.7795 });
  const paperRef = useRef<HTMLDivElement>(null);

  // Add these state declarations at the top
  const [appearanceSettings, setAppearanceSettings] = useState({
    border: {
      width: 0,
      style: 'none',
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

  const [templateName, setTemplateName] = useState('Employee Survey');
  // const [templateIdd, setTemplateId] = useState(templateId);
  const [templateDescription, setTemplateDescription] = useState('Add a description');
  const [gridPadding, setGridPadding] = useState({ top: 10, bottom: 10, left: 10, right: 10 });



  // Fetch template data
  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const response = await api.get(`/form-templates/details?id=${templateId}`);
        if (response.data.status === 'success') {
          const template = response.data.data;
          setTemplateData(template);
          setSelectedSize(template.pageSize || 'A4');
          setBackgroundColor(template.backgroundColor || '#ffffff');

          // setTemplateId(template.formTemplateId);
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
          console.log(template)

          // Initialize appearance settings
          setAppearanceSettings({
            border: {
              width: template.borderWidth === 0 ? undefined : template.borderWidth,
              radius: template.borderRadius,
              style: template.borderStyle,
              color: template.borderColor
            },
            boxShadow: {
              x: template.boxShadowX ?? 0,
              y: template.boxShadowY ?? 4,
              blur: template.boxShadowBlur ?? 12,
              spread: template.boxShadowSpread ?? 0,
              color: template.boxShadowColor ?? 'rgba(0, 0, 0, 0.1)',
              enabled: true
            },
            background: {
              color: template.backgroundColor ?? '#ffffff',
              opacity: ((template.boxShadowOpacity ?? 1) * 100)
            }
          });

        }
      } catch (error) {
        console.error('Error fetching template data:', error);
      }
    };

    if (templateId) {
      fetchTemplateData();
    }
  }, [templateId]);

  const calculateGridSize = () => {
    if (paperRef.current) {
      const { width, height } = pageSizes[selectedSize];
      const parentWidth = paperRef.current.offsetWidth;
      const ratio = height / width;
      const gridWidth = Math.min(parentWidth, width);
      const gridHeight = gridWidth * ratio;
      setGridSize({ width: gridWidth, height: gridHeight });
    }
  };

  useEffect(() => {
    calculateGridSize();
    window.addEventListener('resize', calculateGridSize);
    return () => window.removeEventListener('resize', calculateGridSize);
  }, [selectedSize]);

  return (
    <Paper
      elevation={1}
      ref={paperRef}
      sx={{
        padding: '50px',
        margin: '4px',
        marginTop: '25px',
        borderRadius: 3,
        overflow: 'hidden',
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
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            View Template
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 26, color: 'black' }} />
              <Typography variant="body2" color="textSecondary">
                {templateData?.name || 'Template'}
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">{templateData?.name}</Typography>
            <Typography variant="body2" color="textSecondary" marginBottom="5px" marginTop="-10px">
              {templateData?.description}
            </Typography>
          </Box>

          <div
            style={{
              width: '70vw',
              height: `${70 * (gridSize.height/gridSize.width)}vw`,
              position: "relative",
              border: "1px solid #ccc",
              borderRadius: '15px',
              overflow: "hidden",
              backgroundColor: backgroundColor,
              transition: "all 0.3s ease",
              padding: `${gridPadding.top}px ${gridPadding.right}px ${gridPadding.bottom}px ${gridPadding.left}px`,
              boxSizing: "border-box",
            }}
          >
            <DraggableQuestion
              formTemplateId={templateId || ''}
              items={formFields}
              gridSize={gridSize}
              selectedSize={selectedSize}
              pageSizes={pageSizes}
              onQuestionChange={() => {}}
              onOptionChange={() => {}}
              onDeleteOption={() => {}}
              onAddOption={() => {}}
              isViewMode={true}
              appearanceSettings={appearanceSettings}
              gridPadding={gridPadding}
            />
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ViewTemplate; 