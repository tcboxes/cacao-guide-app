import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// A simple cache for base64 audio data to avoid repeated API calls
const audioCache = new Map<string, string>();

export const generateSpeech = async (text: string): Promise<string> => {
    if (audioCache.has(text)) {
        return audioCache.get(text)!;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        // A calm female voice
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });
        
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            audioCache.set(text, base64Audio);
            return base64Audio;
        }
        throw new Error("No audio data returned from API.");
    } catch (error) {
        console.error("Error generating speech:", error);
        throw error;
    }
};
