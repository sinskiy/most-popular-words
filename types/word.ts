export interface Word {
  value: string;
  occurrences: number;
  saved: boolean;
  percentage: number;
  translations: string[] | null;
  definitions: string[] | null;
  examples: string[] | null;
}

export interface SavedWord extends Word {
  source: string;
  type: string;
  knowledge: (typeof knowledge)[number];
}

export const knowledge = ["again", "hard", "good", "easy"] as const;

export const types = ["books", "docs", "articles"] as const;

export const languages = ["english", "russian"] as const;

export const DEFAULT_SORT = "descending";
export const DEFAULT_LANGUAGE = "english";
