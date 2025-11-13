import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface AudioContextType {
  isAudioEnabled: boolean;
  toggleAudio: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled(prev => !prev);
  }, []);

  return (
    <AudioContext.Provider value={{ isAudioEnabled, toggleAudio }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
