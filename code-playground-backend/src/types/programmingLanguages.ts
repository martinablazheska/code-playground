export enum ProgrammingLanguage {
  TypeScript = "TypeScript",
  JavaScript = "JavaScript",
  Java = "Java",
  Python = "Python",
}

export const DEFAULT_LANGUAGE = ProgrammingLanguage.JavaScript;
export const SUPPORTED_LANGUAGES = Object.values(ProgrammingLanguage);
