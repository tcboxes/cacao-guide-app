import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cacao_saved_intentions';

export const useSavedIntentions = () => {
  const [savedIntentions, setSavedIntentions] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedIntentions = window.localStorage.getItem(STORAGE_KEY);
      if (storedIntentions) {
        setSavedIntentions(JSON.parse(storedIntentions));
      }
    } catch (error) {
      console.error("Failed to load saved intentions from localStorage", error);
    }
  }, []);

  const addIntention = useCallback((intention: string) => {
    if (intention && !savedIntentions.includes(intention)) {
      const newIntentions = [...savedIntentions, intention];
      setSavedIntentions(newIntentions);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newIntentions));
      } catch (error) {
        console.error("Failed to save intention to localStorage", error);
      }
    }
  }, [savedIntentions]);

  const removeIntention = useCallback((intention: string) => {
    const newIntentions = savedIntentions.filter(i => i !== intention);
    setSavedIntentions(newIntentions);
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newIntentions));
    } catch (error) {
        console.error("Failed to remove intention from localStorage", error);
    }
  }, [savedIntentions]);

  return { savedIntentions, addIntention, removeIntention };
};
