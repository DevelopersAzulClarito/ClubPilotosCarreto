import { GoogleGenerativeAI, SchemaType } from "@google/genai"; // OJO: Checa tu versión instalada
// Si usas la versión estándar: import { GoogleGenerativeAI } from "@google/generative-ai";
// Ajuste para @google/generative-ai (más común en web):
import { GoogleGenerativeAI } from "@google/generative-ai";
import { CheckinResult } from '../types';

const schema = {
  description: "Resultado check-in",
  type: "OBJECT", // Ajuste simple para compatibilidad
  properties: {
    isWinner: { type: "BOOLEAN" },
    prize: { type: "STRING", nullable: true },
    xpGained: { type: "INTEGER" },
    message: { type: "STRING" },
  },
  required: ["isWinner", "xpGained", "message"],
};

export const performCheckin = async (playerLevel: number): Promise<CheckinResult> => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) return simulateCheckin();

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `Simula un sorteo para un cliente nivel ${playerLevel}. 
        Probabilidad ganar: 20%. Premios: Café, 10% Desc, Puntos Dobles. 
        XP: 10-50. Mensaje: Divertido y mexicano. Responde JSON: {isWinner, prize, xpGained, message}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const data = JSON.parse(text);
        
        if (!data.isWinner) data.prize = null;
        return data as CheckinResult;

    } catch (error) {
        console.error("Gemini Error:", error);
        return simulateCheckin();
    }
};

const simulateCheckin = (): CheckinResult => ({
    isWinner: Math.random() < 0.2,
    prize: Math.random() < 0.2 ? 'Premio Simulado' : null,
    xpGained: 20,
    message: 'Check-in offline exitoso (+20 XP)'
});