import React from 'react';
import Card from './Card';

interface PreparationScreenProps {
  onReady: () => void;
}

const PreparationScreen: React.FC<PreparationScreenProps> = ({ onReady }) => {
  return (
    <Card>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Find Your Space</h2>
        <div className="text-left text-[#e4d5b7] space-y-4 text-lg">
            <p>
                Before you begin, find a quiet spot where you can be present for a few breaths.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Have your ceremonial cacao bottle ready.</li>
                <li>Give it a gentle shake to mix the cacao.</li>
                <li>Twist the cap and take a moment to notice the aroma.</li>
                <li>Hold the bottle in your hands, feeling its weight.</li>
            </ul>
            <p>
                When you're comfortable and ready to begin, press the button below.
            </p>
        </div>
        <button
            onClick={onReady}
            className="mt-8 w-full bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105"
        >
          I am Ready
        </button>
      </div>
    </Card>
  );
};

export default PreparationScreen;