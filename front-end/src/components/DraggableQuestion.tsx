import React from 'react';
import { Rnd } from "react-rnd";
import { Box, Typography, Button, Radio, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import ReactQuill from 'react-quill';
import { QuestionItem } from '../types/questions';
import DragHandle from './DragHandle';
import QuestionContent from './QuestionContent';
import TitleContent from './TitleContent';
import { TitleItem } from '../types/questions';
interface DraggableQuestionProps {
  item: QuestionItem;
  gridSize: { width: number; height: number };
  selectedSize: string;
  pageSizes: { [key: string]: { width: number; height: number } };
  onDragStop: (id: string, e: any, data: any) => void;
  onResizeStop: (id: string, e: any, direction: any, ref: any, delta: any, position: any) => void;
  onQuestionChange: (itemId: string, newContent: string) => void;
  onOptionChange: (itemId: string, optionId: number, newContent: string) => void;
  onDeleteOption: (itemId: string, optionId: number) => void;
  onAddOption: (itemId: string) => void;
}

const DraggableQuestion: React.FC<DraggableQuestionProps> = ({
  item,
  gridSize,
  selectedSize,
  pageSizes,
  onDragStop,
  onResizeStop,
  onQuestionChange,
  onOptionChange,
  onDeleteOption,
  onAddOption,
  onTitleChange,
  onSubtitleChange,
}) => {
  return (
    <Rnd
      key={item.id}
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
      minHeight={'type' in item && item.type === 'title' ? 150 : 200}
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
      {'type' in item && item.type === 'title' ? (
        <TitleContent
          item={item as TitleItem}
          onTitleChange={onTitleChange!}
          onSubtitleChange={onSubtitleChange!}
        />
      ) : (
        <QuestionContent
          item={item as QuestionItem}
          onQuestionChange={onQuestionChange!}
          onOptionChange={onOptionChange!}
          onDeleteOption={onDeleteOption!}
          onAddOption={onAddOption!}
        />
      )}
    </Rnd>
  );
};

export default DraggableQuestion; 