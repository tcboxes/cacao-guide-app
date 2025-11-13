import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSpeech } from '../services/ttsService';
import { decode, decodeAudioData } from '../utils/audioUtils';

// Global cache to persist AudioBuffers across component re-renders
const audioBufferCache = new Map<string, AudioBuffer>();

export const useTextToSpeech = (text: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Initialize AudioContext on first use
  const getAudioContext = () => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
        // Fix for TypeScript error: Property 'webkitAudioContext' does not exist on type 'Window'.
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContextRef.current;
  };
  
  const stop = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.onended = null; 
      try {
        sourceRef.current.stop();
      } catch (e) {
        // Ignore errors if the source is already stopped
      }
      sourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(async () => {
    stop(); // Always stop previous sound before playing a new one
    setIsLoading(true);

    try {
      const context = getAudioContext();
      if(context.state === 'suspended') {
        await context.resume();
      }
      
      let audioBuffer: AudioBuffer;

      if (audioBufferCache.has(text)) {
        audioBuffer = audioBufferCache.get(text)!;
      } else {
        setIsGenerating(true);
        const base64Audio = await generateSpeech(text);
        const decodedBytes = decode(base64Audio);
        audioBuffer = await decodeAudioData(decodedBytes, context, 24000, 1);
        audioBufferCache.set(text, audioBuffer);
      }
      
      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(context.destination);
      source.start();
      
      setIsPlaying(true);
      
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
      };
      sourceRef.current = source;

    } catch (error) {
      console.error("Failed to play audio:", error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  }, [text, stop]);

  // Cleanup on unmount or when the text to speak changes
  useEffect(() => {
    return () => {
      stop();
    };
  }, [text, stop]);

  return { play, stop, isPlaying, isLoading, isGenerating };
};