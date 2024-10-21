import axios from "axios";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;

export class Judge0Service {
  async submitCode(language: string, sourceCode: string): Promise<string> {
    const options = {
      method: "POST",
      url: `${JUDGE0_API_URL}/submissions`,
      params: {
        base64_encoded: "true",
        wait: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": JUDGE0_API_KEY,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        language_id: this.getLanguageId(language),
        source_code: Buffer.from(sourceCode).toString("base64"),
      },
    };
    try {
      const response = await axios.request(options);
      return response.data.token;
    } catch (error) {
      console.error("Error submitting code to Judge0:", error);
      throw new Error("Failed to submit code");
    }
  }

  async getSubmissionResult(token: string): Promise<any> {
    const options = {
      method: "GET",
      url: `${JUDGE0_API_URL}/submissions/${token}`,
      params: {
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": JUDGE0_API_KEY,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
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

    return languageMap[language];
  }
}
