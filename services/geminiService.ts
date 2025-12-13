
import { GoogleGenAI, Type } from "@google/genai";
import { CheckinResult } from '../types';

const checkinSchema = {
    type: Type.OBJECT,
    properties: {
        isWinner: {
            type: Type.BOOLEAN,
            description: "Indica si el check-in es ganador de un premio."
        },
        prize: {
            type: Type.STRING,
            description: "El premio ganado. Debe ser 'null' si isWinner es false. Ejemplos: 'Café Gratis', 'Descuento de $50', 'Lavado de Auto Express'."
        },
        xpGained: {
            type: Type.INTEGER,
            description: "Puntos de experiencia ganados. Entre 10 y 25."
        },
        message: {
            type: Type.STRING,
            description: "Un mensaje motivacional corto para el piloto. Debe ser amigable y enérgico."
        }
    },
    required: ["isWinner", "prize", "xpGained", "message"],
};


export const performCheckin = async (playerLevel: number): Promise<CheckinResult> => {
    if (!process.env.API_KEY) {
        // Mock response for environments without an API key
        console.warn("API_KEY no encontrada. Usando respuesta mock.");
        const isWinner = Math.random() < 0.2; // 20% chance to win
        return {
            isWinner: isWinner,
            prize: isWinner ? 'Café Gratis de OXXO' : null,
            xpGained: Math.floor(Math.random() * 16) + 10, // 10-25 XP
            message: isWinner ? '¡Felicidades, ganaste!' : '¡Sigue acumulando puntos para ganar!'
        };
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
        Eres el backend del juego "Club Pilotos Carreto".
        Un piloto de nivel ${playerLevel} acaba de hacer un check-in en una gasolinera.
        Determina el resultado del "Sorteo Relámpago".
        La probabilidad de ganar debe ser de aproximadamente 20%. Los pilotos de mayor nivel podrían tener una probabilidad ligeramente mayor.
        Genera una respuesta JSON con el resultado.
        Si isWinner es false, el campo 'prize' debe ser null.
        El mensaje debe ser siempre positivo y animar al jugador a seguir participando.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: checkinSchema,
                temperature: 0.9,
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as CheckinResult;

        // Ensure prize is null if not a winner
        if (!result.isWinner) {
            result.prize = null;
        }

        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get check-in result from Gemini.");
    }
};
