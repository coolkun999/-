import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface PlantIdentificationResult {
  commonName: string;
  scientificName: string;
  family: string;
  description: string;
  careInstructions: {
    watering: string;
    light: string;
    soil: string;
    temperature: string;
  };
  funFact: string;
  isToxicToPets: boolean;
}

export async function identifyPlant(base64Image: string): Promise<PlantIdentificationResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            text: "Identify this plant and provide detailed information including common name, scientific name, family, description, care instructions (watering, light, soil, temperature), a fun fact, and if it is toxic to pets. Return the result in JSON format.",
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(",")[1] || base64Image,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          commonName: { type: Type.STRING },
          scientificName: { type: Type.STRING },
          family: { type: Type.STRING },
          description: { type: Type.STRING },
          careInstructions: {
            type: Type.OBJECT,
            properties: {
              watering: { type: Type.STRING },
              light: { type: Type.STRING },
              soil: { type: Type.STRING },
              temperature: { type: Type.STRING },
            },
            required: ["watering", "light", "soil", "temperature"],
          },
          funFact: { type: Type.STRING },
          isToxicToPets: { type: Type.BOOLEAN },
        },
        required: ["commonName", "scientificName", "family", "description", "careInstructions", "funFact", "isToxicToPets"],
      },
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Failed to identify plant");
  }

  return JSON.parse(text) as PlantIdentificationResult;
}
