import axios from "axios";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export class Judge0Service {
  async submitCode(language: string, sourceCode: string): Promise<string> {
    try {
      const response = await axios.post(
        `${JUDGE0_API_URL}/submissions`,
        {
          language_id: this.getLanguageId(language),
          source_code: Buffer.from(sourceCode).toString("base64"),
          stdin: "",
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      return response.data.token;
    } catch (error) {
      console.error("Error submitting code to Judge0:", error);
      throw new Error("Failed to submit code");
    }
  }

  async getSubmissionResult(token: string): Promise<any> {
    try {
      const response = await axios.get(
        `${JUDGE0_API_URL}/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": JUDGE0_API_KEY,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error getting submission result from Judge0:", error);
      throw new Error("Failed to get submission result");
    }
  }

  private getLanguageId(language: string): number {
    // Map supported languages to Judge0 language IDs
    const languageMap: { [key: string]: number } = {
      JavaScript: 63,
      TypeScript: 74,
      Java: 62,
      Python: 70,
    };

    return languageMap[language.toLowerCase()];
  }
}
