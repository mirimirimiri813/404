export interface Rule {
  id: string;
  number: string;
  content: string;
  note?: {
    text: string;
    type: 'red' | 'blue' | 'black'; // Red = danger/blood, Blue = hint, Black = scribble
    position: 'inline' | 'below' | 'overlay';
  };
  strikethrough?: boolean;
  isGlitch?: boolean;
  hidden?: boolean;
}

export interface Chapter {
  title: string;
  rules: Rule[];
}