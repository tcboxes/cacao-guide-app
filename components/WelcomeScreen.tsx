import React from 'react';
import Card from './Card';
import { CacaoPodIcon } from './icons';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <Card>
        <div className="text-center">
            <CacaoPodIcon className="w-16 h-16 mx-auto text-[#e4d5b7] mb-4"/>
            <h2 className="text-4xl font-bold text-white mb-4">A Moment for You</h2>
            <p className="text-[#e4d5b7] mb-8 text-lg">
                Hello, friend. This is a quiet moment to connect with yourself, wherever you are, through the gentle ritual of ceremonial cacao.
            </p>
            <button
                onClick={onStart}
                className="w-full bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105 active:scale-95"
            >
                Begin
            </button>
        </div>
    </Card>
  );
};

export default WelcomeScreen;