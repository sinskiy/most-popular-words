export interface Word {
  value: string;
  occurrences: number;
  saved: boolean;
  percentage: number;
  translation: string | null;
  definition: string | null;
  example: string | null;
}

export interface SavedWord extends Word {
  source: string;
  knowledge: (typeof knowledge)[number];
}

export const knowledge = ["again", "hard", "good", "easy"] as const;
