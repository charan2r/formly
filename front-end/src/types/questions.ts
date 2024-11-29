export interface QuestionOption {
  id: number;
  text: string;
  value: number;
}

export interface QuestionItem {
  id: string;
  question: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  options?: any[];
}

export interface TitleItem {
  id: string;
  type: 'title';
  title: string;
  subtitle: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BaseQuestionProps {
  item: QuestionItem;
  formFieldId: string;
  onQuestionChange: (itemId: string, newContent: string) => void;
} 