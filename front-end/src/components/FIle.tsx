import React, { useEffect, useRef, useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { ArrowForward } from '@mui/icons-material';
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const pageDimensions = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
  letter: { width: 216, height: 279 },
  legal: { width: 216, height: 356 },
};

const File: React.FC = () => {
  const gridRef = useRef(null);
  const [pageSize, setPageSize] = useState('a4');
  const [gridItems, setGridItems] = useState([
    { x: 0, y: 0, w: 3, h: 3, content: 'item 2' },
  ]);
  const [columns, setColumns] = useState(12);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    const grid = GridStack.init({
      float: true,
      resizable: true,
      column: columns,
      row: rows,
      // maxRow: rows,
    }, gridRef.current);

    gridItems.forEach(item => {
      const element = document.createElement('div');
      element.classList.add('grid-stack-item');
      element.setAttribute('gs-x', item.x.toString());
      element.setAttribute('gs-y', item.y.toString());
      element.setAttribute('gs-w', item.w.toString());
      element.setAttribute('gs-h', item.h.toString());
      element.innerHTML = `<div class="grid-stack-item-content"><b>${item.content}</b></div>`;
      grid.addWidget(element);
    });

    // Save grid layout state on change
    grid.on('change', function(event, items) {
      const updatedItems = items.map(item => ({
        x: item.getAttribute('gs-x'),
        y: item.getAttribute('gs-y'),
        w: item.getAttribute('gs-w'),
        h: item.getAttribute('gs-h'),
        content: item.innerText || item.innerHTML,
      }));
      setGridItems(updatedItems);
    });

    return () => {
      grid.destroy(false);
    };
  }, [gridItems, columns, rows]);

  const captureToPDF = async () => {
    if (gridRef.current) {
      const canvas = await html2canvas(gridRef.current);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: pageSize,
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`grid-capture-${pageSize}.pdf`);
    }
  };

  const handlePageSizeChange = (event) => {
    const newSize = event.target.value;
    const scale = pageDimensions[newSize].width / pageDimensions[pageSize].width;

    const scaledItems = gridItems.map(item => ({
      ...item,
      x: Math.round(item.x * scale),
      y: Math.round(item.y * scale),
      w: Math.round(item.w * scale),
      h: Math.round(item.h * scale),
    }));
    setGridItems(scaledItems);
    setPageSize(newSize);
  };

  const handleColumnChange = (event) => {
    setColumns(Number(event.target.value));
  };

  const handleRowChange = (event) => {
    setRows(Number(event.target.value));
  };

  return (
    <Paper
      elevation={4}
      sx={{
        width: '100%',
        padding: '2%',
        borderRadius: 3,
        overflow: 'auto',
        margin: '5px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        {/* Header Section */}
        <Box display="flex" alignItems="center" gap={1} marginLeft="-10px">
          <IconButton onClick={() => console.log("Back arrow clicked")}>
            <CircleIcon style={{ color: 'black' }} />
          </IconButton>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Atlas Corp.
          </Typography>
          <ArrowForward style={{ color: 'black' }} />
          <Typography variant="body2" color="textSecondary">
            Create template
          </Typography>
        </Box>
        <Typography variant="h5" fontWeight="bold">Employee Survey</Typography>
        <Typography variant="body2" marginBottom="5px" marginTop="-10px">
          Employee satisfactory survey form template
        </Typography>
      </Box>

      <Box
        sx={{
          width: `${pageDimensions[pageSize].width}mm`,
          minHeight: `${pageDimensions[pageSize].height}mm`,
          padding: '5px',
          border: '1px dashed',
          borderRadius: '15px',
          marginTop: '4%',
          overflow: 'hidden'
        }}
        className="grid-stack"
        ref={gridRef}
      ></Box>

      {/* Dropdown to select page size */}
      <Box display="flex" alignItems="center" gap={2} marginTop="15px">
        <Typography variant="body2">Select Page Size:</Typography>
        <Select
          value={pageSize}
          onChange={handlePageSizeChange}
        >
          <MenuItem value="a4">A4</MenuItem>
          <MenuItem value="a3">A3</MenuItem>
          <MenuItem value="letter">Letter</MenuItem>
          <MenuItem value="legal">Legal</MenuItem>
        </Select>
      </Box>

      {/* Inputs to adjust number of columns and rows */}
      <Box display="flex" gap={2} marginTop="15px">
        <TextField
          label="Columns"
          type="number"
          value={columns}
          onChange={handleColumnChange}
          variant="outlined"
          size="small"
        />
        <TextField
          label="Rows"
          type="number"
          value={rows}
          onChange={handleRowChange}
          variant="outlined"
          size="small"
        />
      </Box>

      {/* Button to Capture and Save PDF */}
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: '15px' }}
        onClick={captureToPDF}
      >
        Export Grid as PDF
      </Button>
    </Paper>
  );
};

export default File;
