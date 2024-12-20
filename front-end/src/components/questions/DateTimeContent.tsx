import React from 'react';
import DateContent from './DateContent';
import { QuestionItem } from '../../types/questions';

interface DateTimeContentProps {
  item: QuestionItem;
  formFieldId: string;
  onQuestionChange: (itemId: string, newContent: string) => void;
  onEditorFocus: (fieldId: string, editorId: string, quill: any) => void;
  activeFieldId: string | null;
  activeEditorId: string | null;
}

const DateTimeContent: React.FC<DateTimeContentProps> = (props) => {
  return <DateContent {...props} type="datetime" />;
};

export default DateTimeContent; 