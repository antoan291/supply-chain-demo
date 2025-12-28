import { GoogleGenAI, Type } from "@google/genai";
import { DocumentAnalysisResult, AnalysisType } from "../types";
const ai = new GoogleGenAI({
  apiKey: "AIzaSyBi6pNZWNZf58HAFNK4HA2dmK586H8n5S0",
});

/**
 * Performs a quick structured data extraction using Flash.
 * Optimized for speed and basic entity recognition.
 */
export const performQuickExtraction = async (
  text: string
): Promise<DocumentAnalysisResult> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Analyze the following supply chain document snippet. 
      Extract key operational entities (Dates, Amounts, Invoice IDs, Vendor Names).
      Return a trusted, structured summary.
      
      Document snippet: "${text}"
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            confidenceScore: {
              type: Type.NUMBER,
              description: "Confidence score between 0 and 100",
            },
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  value: { type: Type.STRING },
                },
              },
            },
          },
        },
      },
    });

    const json = JSON.parse(response.text || "{}");
    return {
      type: "extraction",
      summary: json.summary,
      confidenceScore: json.confidenceScore,
      entities: json.entities,
    };
  } catch (error) {
    console.error("Extraction failed", error);
    throw new Error("Unable to extract structured data.");
  }
};

/**
 * Performs a deep forensic audit using Gemini 3 Pro with Thinking Mode.
 * Optimized for complex reasoning, risk detection, and logical consistency.
 */
export const performDeepAudit = async (
  text: string
): Promise<DocumentAnalysisResult> => {
  try {
    const model = "gemini-3-pro-preview";
    const prompt = `
      Act as a senior supply chain risk auditor. 
      Analyze the text for logical inconsistencies, potential fraud indicators, or contractual ambiguities.
      Think deeply about the implications of the terms used.
      
      Text to audit: "${text}"
    `;

    // Using Thinking Budget for complex reasoning
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }, // Max thinking budget for Pro
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "Executive summary of the audit findings.",
            },
            confidenceScore: { type: Type.NUMBER },
            risks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of identified potential risks or anomalies.",
            },
          },
        },
      },
    });

    const json = JSON.parse(response.text || "{}");
    return {
      type: "audit",
      summary: json.summary,
      confidenceScore: json.confidenceScore,
      risks: json.risks,
    };
  } catch (error) {
    console.error("Audit failed", error);
    throw new Error("Deep audit analysis failed.");
  }
};

/**
 * basic market verification using Google Search Grounding.
 * Verifies if vendors or terms mentioned are real and active.
 */
export const performMarketContextCheck = async (
  text: string
): Promise<DocumentAnalysisResult> => {
  try {
    const model = "gemini-3-flash-preview";
    const prompt = `
      Identify the main company or product mentioned in this text: "${text}".
      Use Google Search to verify its current operational status, recent news, or corporate existence.
      Provide a brief briefing on the entity.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    // Extract grounding metadata if available
    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: string) => !!uri);

    // Remove duplicates
    const uniqueSources = Array.from(new Set(sources)) as string[];

    return {
      type: "intelligence",
      summary: response.text || "Market context analysis complete.",
      confidenceScore: 95, // High confidence due to search grounding
      marketContext: uniqueSources,
    };
  } catch (error) {
    console.error("Market context check failed", error);
    throw new Error("Unable to retrieve market context.");
  }
};
