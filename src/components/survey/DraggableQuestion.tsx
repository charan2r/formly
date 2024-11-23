import React from 'react';
import { Rnd } from 'react-rnd';
import { Box, Typography } from '@mui/material';
import { SurveyItem, GridSize } from '../../../../src/types/survey.types';
import { pageSizes } from '../../../../src/constants/surveyConstants';
import SurveyQuestion from '../../../front-end/src/components/survey/SurveyQuestion';

interface DraggableQuestionProps {
  item: SurveyItem;
  gridSize: GridSize;
  selectedSize: string;
  onDragStop: (id: string, e: any, data: any) => void;
  onResizeStop: (id: string, e: any, direction: any, ref: any, delta: any, position: any) => void;
  onQuestionChange: (id: string, content: string) => void;
  onOptionChange: (id: string, optionId: number, content: string) => void;
  onDeleteOption: (id: string, optionId: number) => void;
  onAddOption: (id: string) => void;
}

export const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  item,
  gridSize,
  selectedSize,
  onDragStop,
  onResizeStop,
  onQuestionChange,
  onOptionChange,
  onDeleteOption,
  onAddOption,
}) => {
  return (
    <Rnd
      size={{
        width: (item.width / pageSizes[selectedSize].width) * gridSize.width,
        height: (item.height / pageSizes[selectedSize].height) * gridSize.height,
      }}
      position={{
        x: (item.x / pageSizes[selectedSize].width) * gridSize.width,
        y: (item.y / pageSizes[selectedSize].height) * gridSize.height,
      }}
      onDragStop={(e, data) => onDragStop(item.id, e, data)}
      onResizeStop={(e, direction, ref, delta, position) =>
        onResizeStop(item.id, e, direction, ref, delta, position)
      }
      minWidth={300}
      minHeight={200}
      bounds="parent"
      dragHandleClassName="drag-handle"
      style={{
        backgroundColor: '#ffffff',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          height: '100%',
          '&:hover .drag-handle': {
            opacity: 1,
          },
        }}
      >
        <Box 
          className="drag-handle" 
          sx={{ 
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            height: '24px',
            padding: '0 12px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            borderRadius: '12px',
            cursor: 'move',
            display: 'flex',
            alignItems: 'center',
            opacity: 0,
            transition: 'opacity 0.2s ease-in-out',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            },
          }}
        >
          <Typography variant="caption" sx={{ userSelect: 'none' }}>
            Drag to move
          </Typography>
        </Box>

        <SurveyQuestion
          item={item}
          onQuestionChange={onQuestionChange}
          onOptionChange={onOptionChange}
          onDeleteOption={onDeleteOption}
          onAddOption={onAddOption}
        />
      </Box>
    </Rnd>
  );
}; 