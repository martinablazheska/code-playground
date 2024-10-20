export enum ProgrammingLanguage {
  TypeScript = "typescript",
  JavaScript = "javascript",
  PHP = "php",
  CSharp = "csharp",
  CPlusPlus = "cpp",
  Java = "java",
  Python = "python",
  Ruby = "ruby",
}

export const DEFAULT_LANGUAGE = ProgrammingLanguage.JavaScript;
export const SUPPORTED_LANGUAGES = Object.values(ProgrammingLanguage);
