import React, { useState, useRef, useEffect } from 'react';
import {
  Paper,
  Box,
  Grid,
  Typography,
  IconButton,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Radio from '@mui/material/Radio';

const pageSizes = {
  A4: { width: 210 * 3.7795, height: 297 * 3.7795 },
  A3: { width: 297 * 3.7795, height: 420 * 3.7795 },
  Custom: { width: 800, height: 600 },
};

const ViewTemplate: React.FC = () => {
  const [selectedSize] = useState("A4");
  const [orientation] = useState("Portrait");
  const [backgroundColor] = useState('#ffffff');
  const [gridSize, setGridSize] = useState({ width: 210 * 3.7795, height: 297 * 3.7795 });
  const paperRef = useRef<HTMLDivElement>(null);
  const [items] = useState([
    {
      id: "1",
      x: 0,
      y: 0,
      width: 250,
      height: 500,
      question: "How satisfied are you with the company's professional development opportunities?",
      options: [
        { id: 1, text: 'Very Satisfied', value: 5 },
        { id: 2, text: 'Satisfied', value: 4 },
        { id: 3, text: 'Neutral', value: 3 },
        { id: 4, text: 'Dissatisfied', value: 2 },
        { id: 5, text: 'Very Dissatisfied', value: 1 }
      ]
    }
  ]);

  const calculateGridSize = () => {
    if (paperRef.current) {
      const { width, height } = pageSizes[selectedSize];
      const isPortrait = orientation === "Portrait";
      const effectiveWidth = isPortrait ? width : height;
      const effectiveHeight = isPortrait ? height : width;
  
      const parentWidth = paperRef.current.offsetWidth;
      const ratio = effectiveHeight / effectiveWidth;
  
      const gridWidth = Math.min(parentWidth, effectiveWidth);
      const gridHeight = gridWidth * ratio;
  
      setGridSize({ width: gridWidth, height: gridHeight });
    }
  };

  useEffect(() => {
    calculateGridSize();
  }, [selectedSize, orientation]);

  return (
    <Paper
      elevation={1}
      ref={paperRef}
      sx={{
        padding: '50px',
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
              <IconButton>
                <CircleIcon style={{ color: 'black' }} />
              </IconButton>
              <ArrowForward style={{ color: 'black' }} />
              <Typography variant="body2" color="textSecondary">
                Atlas Corp. 
              </Typography>
              <ArrowForward style={{ color: 'black' }} />
              <Typography variant="body2" color="textSecondary">
                View Template
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight="bold">Employee Survey</Typography>
            <Typography variant="body2" color="textSecondary" marginBottom="5px" marginTop="-10px">
              Survey Description
            </Typography>
          </Box>

          <div
            style={{
              width: '70vw',
              height: `${70 * (gridSize.height/gridSize.width)}vw`,
              position: "relative",
              border: "1px solid #ccc",
              borderRadius: '15px',
              overflow: "auto",
              backgroundColor: backgroundColor,
              transition: "all 0.3s ease",
              padding: '10px',
              boxSizing: "border-box",
            }}
          >
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  position: 'relative',
                  width: (item.width / pageSizes[selectedSize].width) * gridSize.width,
                  height: (item.height / pageSizes[selectedSize].height) * gridSize.height,
                  left: (item.x / pageSizes[selectedSize].width) * gridSize.width,
                  top: (item.y / pageSizes[selectedSize].height) * gridSize.height,
                  backgroundColor: '#ffffff',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid #e0e0e0',
                  padding: '16px',
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', mb: 2 }}>
                  Question {item.id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {item.question}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {item.options.map((option) => (
                    <Box
                      key={option.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1,
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <Radio
                        size="small"
                        disabled
                        sx={{
                          color: '#757575',
                        }}
                      />
                      <Typography variant="body2">
                        {option.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ViewTemplate; 