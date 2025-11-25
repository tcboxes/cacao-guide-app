import React from 'react';
import Card from './Card';
import { WelcomeTriangleIcon } from './icons';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <Card>
        <div className="text-center">
            {/* The Labelled Triangle Graphic */}
            <WelcomeTriangleIcon className="w-56 h-56 mx-auto text-[#e4d5b7] mb-2 -mt-6"/>
            
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