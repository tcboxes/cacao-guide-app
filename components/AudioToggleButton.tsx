import React from 'react';
import { useAudio } from '../context/AudioContext';
import { SpeakerOnIcon, SpeakerOffIcon } from './icons';

const AudioToggleButton: React.FC = () => {
  const { isAudioEnabled, toggleAudio } = useAudio();

  return (
    <button
      onClick={toggleAudio}
      className="p-2 rounded-full hover:bg-white/10 transition-all active:scale-90"
      aria-label={isAudioEnabled ? 'Disable audio guide' : 'Enable audio guide'}
    >
      {isAudioEnabled ? (
        <SpeakerOnIcon className="w-6 h-6 text-[#e4d5b7]" />
      ) : (
        <SpeakerOffIcon className="w-6 h-6 text-[#e4d5b7]/70" />
      )}
    </button>
  );
};

export default AudioToggleButton;