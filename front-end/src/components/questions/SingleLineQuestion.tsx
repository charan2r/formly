import React from 'react';
import { Box, TextField } from '@mui/material';
import { QuestionWrapper } from './QuestionWrapper';
import { BaseQuestionProps } from '../../types/questions';

interface SingleLineQuestionProps extends BaseQuestionProps {
  placeholder?: string;
}

const SingleLineQuestion: React.FC<SingleLineQuestionProps> = ({
  item,
  formFieldId,
  onQuestionChange,
}) => {
  return (
    <QuestionWrapper
      item={item}
      formFieldId={formFieldId}
      onQuestionChange={onQuestionChange}
    >
      <TextField
        fullWidth
        placeholder="Single line answer"
        disabled
        sx={{ mt: 2 }}
      />
    </QuestionWrapper>
  );
};

export default SingleLineQuestion; 