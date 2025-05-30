export const DEFAULT_SORT = "descending";
export const DEFAULT_LANGUAGE = "english";

// unfortunately, they have to be hand-made as if I import the db-generated types, next.js tries to load the db too which leads to an error
export const knowledgeArray = ["again", "hard", "good", "easy"] as const;
export const sourceTypeArray = ["book", "docs", "article"] as const;
export const languageArray = ["english", "russian"] as const;
