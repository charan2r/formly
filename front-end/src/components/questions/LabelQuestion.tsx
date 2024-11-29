import React from 'react';
import { Box } from '@mui/material';
import { QuestionWrapper } from './QuestionWrapper';
import { BaseQuestionProps } from '../../types/questions';

const LabelQuestion: React.FC<BaseQuestionProps> = ({
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
      {/* Intentionally empty - only the question editor from QuestionWrapper will be shown */}
    </QuestionWrapper>
  );
};

export default LabelQuestion; 