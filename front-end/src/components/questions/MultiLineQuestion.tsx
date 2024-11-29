import React from 'react';
import { Box, TextField } from '@mui/material';
import { QuestionWrapper } from './QuestionWrapper';
import { BaseQuestionProps } from '../../types/questions';

interface MultiLineQuestionProps extends BaseQuestionProps {
  rows?: number;
}

const MultiLineQuestion: React.FC<MultiLineQuestionProps> = ({
  item,
  formFieldId,
  onQuestionChange,
  rows = 4,
}) => {
  return (
    <QuestionWrapper
      item={item}
      formFieldId={formFieldId}
      onQuestionChange={onQuestionChange}
    >
      <TextField
        fullWidth
        multiline
        rows={rows}
        placeholder="Multiline answer"
        disabled
        sx={{ mt: 2 }}
      />
    </QuestionWrapper>
  );
};

export default MultiLineQuestion; 