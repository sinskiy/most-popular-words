export interface Word {
  value: string;
  occurrences: number;
  saved: boolean;
  percentage: number;
  translation: string | null;
  definition: string | null;
  example: string | null;
}
