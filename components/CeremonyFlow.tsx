import React, { useState } from 'react';
import type { CeremonyStep } from '../types';
import Card from './Card';

interface CeremonyFlowProps {
  intention: string;
  onComplete: () => void;
}

const ceremonySteps: CeremonyStep[] = [
    {
        title: "Arrive",
        description: "Hold the bottle in both hands. Close your eyes and take three deep, slow breaths. Feel yourself arriving in this present moment."
    },
    {
        title: "Gratitude",
        description: "Feel the glass in your hands. Silently give thanks for this moment, the Earth, and all the hands that brought this cacao to you."
    },
    {
        title: "Intention",
        description: "Bring your intention to mind. Whisper it silently or aloud, stating your purpose for this moment."
    },
    {
        title: "First Sip",
        description: "Take your first sip. Drink it slowly, mindfully. Notice the rich flavors, the smooth texture, and the sensation as it fills you."
    },
    {
        title: "Savor",
        description: "Continue to drink your cacao without rush. Be fully present with each sip. This is a moment of nourishment for your body and being."
    },
    {
        title: "Connect",
        description: "Once finished, place your empty bottle aside. Rest a hand on your heart. Close your eyes and notice the sensations within you. Sit in silence for a few breaths."
    },
    {
        title: "Reflection",
        description: "Gently open your eyes. Reflect on your experience. What feelings or insights arose? Carry this feeling of connection with you."
    }
];

const CeremonyFlow: React.FC<CeremonyFlowProps> = ({ intention, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = ceremonySteps[currentStepIndex];
  
  const handleNext = () => {
    if (currentStepIndex < ceremonySteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }

  const progress = ((currentStepIndex + 1) / ceremonySteps.length) * 100;

  return (
    <Card className="flex flex-col h-full">
      <div className="flex-grow text-center relative">
        <p className="text-sm uppercase tracking-widest text-[#e4d5b7]/70 mb-2">Step {currentStepIndex + 1} of {ceremonySteps.length}</p>
        <h2 className="text-4xl font-bold text-white mb-6">{step.title}</h2>
        <div className="relative">
            <p className="text-[#e4d5b7] text-xl leading-relaxed min-h-[120px]">
              {step.description}
               {step.title === 'Intention' && (
                  <span className="block font-serif italic text-white mt-4">"{intention}"</span>
              )}
            </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="w-full bg-[#6f5e53] rounded-full h-2 mb-6">
            <div className="bg-[#e4d5b7] h-2 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
        </div>
        <div className="flex justify-between gap-4">
            <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex-1 bg-transparent border border-[#e4d5b7] text-[#e4d5b7] font-bold py-3 px-6 rounded-lg hover:bg-[#e4d5b7]/10 transition-transform transform hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
            >
                Previous
            </button>
            <button
                onClick={handleNext}
                className="flex-1 bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105"
            >
                {currentStepIndex === ceremonySteps.length - 1 ? 'Finish' : 'Next'}
            </button>
        </div>
      </div>
    </Card>
  );
};

export default CeremonyFlow;