import React from 'react';
import { Box, IconButton, Divider, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatColorText,
  FormatColorFill,
  Title,
  Subscript,
  Superscript,
  FormatIndentDecrease,
  FormatIndentIncrease,
  Link,
  Image,
  FormatClear,
  Undo,
  Redo
} from '@mui/icons-material';

interface GlobalQuillToolbarProps {
  onFormatChange: (format: string, value: any) => void;
  isEnabled: boolean;
}

const GlobalQuillToolbar: React.FC<GlobalQuillToolbarProps> = ({ onFormatChange, isEnabled }) => {
  const handleFormatClick = (format: string, value: any) => {
    console.log('🔧 Toolbar Action:', {
      format,
      value,
      isEnabled,
      timestamp: new Date().toISOString()
    });
    
    onFormatChange(format, value);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'nowrap',
        overflowX: 'auto'
      }}
    >
      {/* Text Formatting */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Bold">
          <IconButton 
            size="small" 
            onClick={() => handleFormatClick('bold', true)}
            disabled={!isEnabled}
          >
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Italic">
          <IconButton size="small" onClick={() => handleFormatClick('italic', true)}>
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Underline">
          <IconButton size="small" onClick={() => handleFormatClick('underline', true)}>
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Strike Through">
          <IconButton size="small" onClick={() => handleFormatClick('strike', true)}>
            <StrikethroughS fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Headers and Scripts */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Heading 1">
          <IconButton size="small" onClick={() => handleFormatClick('header', 1)}>
            <Title fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Subscript">
          <IconButton size="small" onClick={() => handleFormatClick('script', 'sub')}>
            <Subscript fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Superscript">
          <IconButton size="small" onClick={() => handleFormatClick('script', 'super')}>
            <Superscript fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Alignment */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Align Left">
          <IconButton size="small" onClick={() => handleFormatClick('align', 'left')}>
            <FormatAlignLeft fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Center">
          <IconButton size="small" onClick={() => handleFormatClick('align', 'center')}>
            <FormatAlignCenter fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Right">
          <IconButton size="small" onClick={() => handleFormatClick('align', 'right')}>
            <FormatAlignRight fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Justify">
          <IconButton size="small" onClick={() => handleFormatClick('align', 'justify')}>
            <FormatAlignJustify fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Lists and Indentation */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Bullet List">
          <IconButton size="small" onClick={() => handleFormatClick('list', 'bullet')}>
            <FormatListBulleted fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Numbered List">
          <IconButton size="small" onClick={() => handleFormatClick('list', 'ordered')}>
            <FormatListNumbered fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Decrease Indent">
          <IconButton size="small" onClick={() => handleFormatClick('indent', '-1')}>
            <FormatIndentDecrease fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Increase Indent">
          <IconButton size="small" onClick={() => handleFormatClick('indent', '+1')}>
            <FormatIndentIncrease fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Colors */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Text Color">
          <IconButton size="small" onClick={() => handleFormatClick('color', true)}>
            <FormatColorText fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Background Color">
          <IconButton size="small" onClick={() => handleFormatClick('background', true)}>
            <FormatColorFill fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Insert */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Insert Link">
          <IconButton size="small" onClick={() => handleFormatClick('link', true)}>
            <Link fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Insert Image">
          <IconButton size="small" onClick={() => handleFormatClick('image', true)}>
            <Image fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Clear Formatting and History */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Clear Formatting">
          <IconButton size="small" onClick={() => handleFormatClick('clear', true)}>
            <FormatClear fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Undo">
          <IconButton size="small" onClick={() => handleFormatClick('undo', true)}>
            <Undo fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Redo">
          <IconButton size="small" onClick={() => handleFormatClick('redo', true)}>
            <Redo fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default GlobalQuillToolbar;
