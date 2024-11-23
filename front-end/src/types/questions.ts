export interface QuestionOption {
  id: number;
  text: string;
  value: number;
}

export interface QuestionItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  question: string;
  options: QuestionOption[];
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