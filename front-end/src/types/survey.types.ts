export interface Option {
  id: number;
  text: string;
  value: number;
}

export interface SurveyItem {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  question: string;
  options: Option[];
}

export interface GridSize {
  width: number;
  height: number;
}

export interface GridPadding {
  top: number;
  bottom: number;
  left: number;
  right: number;
} 