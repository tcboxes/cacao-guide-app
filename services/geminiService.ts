import { GoogleGenAI, Type } from "@google/genai";

export const generateIntentions = async (theme?: string): Promise<string[]> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set. Using fallback intentions.");
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        console.warn("Could not generate intentions via API, using fallbacks.", error);
        if (theme === 'Self-love') {
            return [
                "To honour my body and spirit with kindness.",
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
                "To release anxious energy and find my centre.",
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

export const generatePersonalizedSteps = async (intention: string): Promise<{ savourDescription: string; connectDescription: string; } | null> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set. Cannot personalise steps.");
        }
        if (!intention) return null;

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `You are a guide for a brief ceremonial cacao ritual. A user has set the intention: "${intention}". Your task is to rewrite the descriptions for two specific steps of the ceremony, 'Savour' and 'Connect', to align with this intention.

        **Rules:**
        - Keep the descriptions brief (2-3 sentences).
        - The tone must be calm, gentle, and encouraging.
        - Do not assume the cacao is warm. If you mention temperature, use neutral language like "notice its temperature".
        - **For 'Savour':** The description should encourage mindful drinking of the cacao while relating it to their intention.
        - **For 'Connect':** The description should guide them to reflect inwardly after finishing the cacao, connecting the feeling to their intention. The primary action should be to 'focus on the breath'.
        
        Return ONLY a JSON object with two keys: 'savourDescription' and 'connectDescription'.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        savourDescription: { type: Type.STRING, description: "Personalised description for the Savour step." },
                        connectDescription: { type: Type.STRING, description: "Personalised description for the Connect step." }
                    },
                    required: ['savourDescription', 'connectDescription']
                }
            }
        });

        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);

        if (result.savourDescription && result.connectDescription) {
            return result;
        }

        return null;
    } catch (error) {
        console.warn("Could not generate personalised steps via API, using defaults.", error);
        return null;
    }
};


export const generateClosingAffirmation = async (intention: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set. Using fallback affirmation.");
        }
        if (!intention) {
            return "May you carry this peace with you.";
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

        const prompt = `Generate a single, short, uplifting affirmation for someone whose intention was "${intention}". Keep it to one sentence. The tone should be gentle and encouraging.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const affirmation = response.text.trim();
        if (affirmation) {
            // Remove potential quotes from the AI response
            return affirmation.replace(/^"|"$/g, '');
        }
        
        return "May the feeling of this moment stay with you.";

// FIX: Added curly braces to the catch block to fix a syntax error.
    } catch (error) {
        console.warn("Could not generate closing affirmation via API, using fallback.", error);
        return "May you carry the peace and your intention with you throughout your day.";
    }
};