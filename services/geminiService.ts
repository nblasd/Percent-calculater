
import { GoogleGenAI } from "@google/genai";

export const solveMathProblem = async (query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful mathematical and financial assistant. 
      The user is asking a question about percentages or calculations. 
      Provide a clear, concise answer with the steps if necessary.
      Keep it professional and friendly.
      
      User question: ${query}`,
      config: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 500,
      }
    });

    return response.text || "I'm sorry, I couldn't process that calculation. Please try rephrasing.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while processing your request. Please ensure your query is valid.";
  }
};
