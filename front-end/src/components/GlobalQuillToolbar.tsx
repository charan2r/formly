import React, { useState } from 'react';
import { Box, IconButton, Divider, Tooltip, Select, MenuItem, Popover, Button } from '@mui/material';
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface GlobalQuillToolbarProps {
  onFormatChange: (format: string, value: any) => void;
  isEnabled: boolean;
}

const GlobalQuillToolbar: React.FC<GlobalQuillToolbarProps> = ({ onFormatChange, isEnabled }) => {
  const [textColorAnchor, setTextColorAnchor] = useState<null | HTMLElement>(null);
  const [bgColorAnchor, setBgColorAnchor] = useState<null | HTMLElement>(null);
  const [selectedTextColor, setSelectedTextColor] = useState('#000000');
  const [selectedBgColor, setSelectedBgColor] = useState('#ffffff');
  const [imageAnchor, setImageAnchor] = useState<null | HTMLElement>(null);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleFormatClick = (format: string, value: any) => {
    console.log('🔧 Toolbar Action:', {
      format,
      value,
      isEnabled,
      timestamp: new Date().toISOString()
    });
    
    onFormatChange(format, value);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        handleFormatClick('image', imageUrl);
        setImageAnchor(null);
      };
      reader.readAsDataURL(file);
    }
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

      {/* Headers Dropdown */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Heading Style">
          <Select
            size="small"
            defaultValue="normal"
            onChange={(e) => handleFormatClick('header', e.target.value === 'normal' ? false : Number(e.target.value))}
            sx={{
              minWidth: '120px',
              height: '32px',
              '.MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 0.5,
              }
            }}
            IconComponent={KeyboardArrowDownIcon}
          >
            <MenuItem value="normal" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Title fontSize="small" sx={{ textDecoration: 'line-through' }} />
              <span>Normal</span>
            </MenuItem>
            <MenuItem value="1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Title fontSize="small" />
              <span>Heading 1</span>
            </MenuItem>
            <MenuItem value="2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Title fontSize="small" sx={{ transform: 'scale(0.9)' }} />
              <span>Heading 2</span>
            </MenuItem>
            <MenuItem value="3" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Title fontSize="small" sx={{ transform: 'scale(0.8)' }} />
              <span>Heading 3</span>
            </MenuItem>
          </Select>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      {/* Scripts */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
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
          <IconButton 
            size="small" 
            onClick={() => handleFormatClick('align', '')}
          >
            <FormatAlignLeft fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Center">
          <IconButton 
            size="small" 
            onClick={() => handleFormatClick('align', 'center')}
          >
            <FormatAlignCenter fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Align Right">
          <IconButton 
            size="small" 
            onClick={() => handleFormatClick('align', 'right')}
          >
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
          <IconButton 
            size="small" 
            onClick={(e) => setTextColorAnchor(e.currentTarget)}
          >
            <FormatColorText fontSize="small" />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(textColorAnchor)}
          anchorEl={textColorAnchor}
          onClose={() => setTextColorAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 1 }}>
            <input
              type="color"
              value={selectedTextColor}
              onChange={(e) => {
                setSelectedTextColor(e.target.value);
                handleFormatClick('color', e.target.value);
                setTextColorAnchor(null);
              }}
              style={{
                width: '200px',
                height: '40px',
                padding: '0',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          </Box>
        </Popover>

        <Tooltip title="Background Color">
          <IconButton 
            size="small" 
            onClick={(e) => setBgColorAnchor(e.currentTarget)}
          >
            <FormatColorFill fontSize="small"  />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(bgColorAnchor)}
          anchorEl={bgColorAnchor}
          onClose={() => setBgColorAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 1 }}>
            <input
              type="color"
              value={selectedBgColor}
              onChange={(e) => {
                setSelectedBgColor(e.target.value);
                handleFormatClick('background', e.target.value);
                setBgColorAnchor(null);
              }}
              style={{
                width: '200px',
                height: '40px',
                padding: '0',
                border: 'none',
                cursor: 'pointer'
              }}
            />
          </Box>
        </Popover>
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
          <IconButton 
            size="small" 
            onClick={(e) => setImageAnchor(e.currentTarget)}
          >
            <Image fontSize="small" />
          </IconButton>
        </Tooltip>
        <Popover
          open={Boolean(imageAnchor)}
          anchorEl={imageAnchor}
          onClose={() => setImageAnchor(null)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, width: '300px' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  flex: 1
                }}
              />
              <IconButton 
                size="small"
                onClick={() => {
                  if (imageUrl) {
                    handleFormatClick('image', imageUrl);
                    setImageUrl('');
                    setImageAnchor(null);
                  }
                }}
              >
                <Image fontSize="small" />
              </IconButton>
            </Box>
            <Divider sx={{ my: 1 }}>OR</Divider>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button
                component="span"
                variant="outlined"
                size="small"
                fullWidth
                startIcon={<Image />}
              >
                Upload Image
              </Button>
            </label>
          </Box>
        </Popover>
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
