import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateIntentions = async (theme?: string): Promise<string[]> => {
    try {
        let prompt = 'Generate a list of 3 simple, one-sentence intentions for a brief moment of calm with ceremonial cacao. The intentions are for a busy person and should focus on themes like presence, clarity, peace, gratitude, or releasing stress.';

        if (theme) {
             prompt = `Generate a list of 3 simple, one-sentence intentions for a brief moment of calm with ceremonial cacao, focusing on the theme of "${theme}". The intentions should be suitable for a busy person and be phrased as personal affirmations.`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        intentions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING,
                                description: 'A single, brief intention.'
                            }
                        }
                    },
                    required: ['intentions']
                }
            }
        });
        
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (result.intentions && Array.isArray(result.intentions)) {
            return result.intentions;
        }
        
        return [];
    } catch (error) {
        console.error("Error generating intentions:", error);
        if (theme === 'Self-love') {
            return [
                "To honor my body and spirit with kindness.",
                "To embrace my worthiness and inner light.",
                "To offer myself the compassion I freely give others."
            ];
        }
        if (theme === 'Creativity') {
            return [
                "To awaken my inner artist and see the world anew.",
                "To release creative blocks and invite inspiration.",
                "To express my unique perspective with confidence."
            ];
        }
         if (theme === 'Grounding') {
            return [
                "To feel my connection to the earth and be present.",
                "To release anxious energy and find my center.",
                "To anchor my thoughts in the stability of this moment."
            ];
        }
        if (theme === 'Work') {
            return [
                "To calm my mind before my next meeting.",
                "To reset my mind and release the stress of my workday.",
                "To find focus and clarity for the tasks ahead."
            ];
        }
        return [
            "To be present and open to the moment.",
            "To find a moment of peace in my busy day.",
            "To connect with my inner self."
        ];
    }
};