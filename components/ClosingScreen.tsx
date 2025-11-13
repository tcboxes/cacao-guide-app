import React from 'react';
import Card from './Card';
import { HeartIcon } from './icons';

interface ClosingScreenProps {
  onRestart: () => void;
}

const ClosingScreen: React.FC<ClosingScreenProps> = ({ onRestart }) => {
  const message = "Thank you for sharing this time.";

  return (
    <Card>
      <div className="text-center">
        <HeartIcon className="w-16 h-16 mx-auto text-[#e4d5b7] mb-4"/>
        <h2 className="text-4xl font-bold text-white mb-4">Ceremony Complete</h2>
        <p className="text-[#e4d5b7] mb-8 text-lg">
        {message} May you carry the warmth and your intention with you throughout your day.
        </p>
        <button
            onClick={onRestart}
            className="w-full bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105"
        >
          Begin Another Ceremony
        </button>
      </div>
    </Card>
  );
};

export default ClosingScreen;
