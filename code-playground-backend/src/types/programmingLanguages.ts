export enum ProgrammingLanguage {
  TypeScript = "TypeScript",
  JavaScript = "JavaScript",
  PHP = "PHP",
  CSharp = "C#",
  CPlusPlus = "C++",
  Java = "Java",
  Python = "Python",
  Ruby = "Ruby",
}

export const DEFAULT_LANGUAGE = ProgrammingLanguage.JavaScript;
export const SUPPORTED_LANGUAGES = Object.values(ProgrammingLanguage);
