import React, { useState, useEffect } from 'react';
import type { CeremonyStep } from '../types';
import Card from './Card';
import { useAudio } from '../context/AudioContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { SpeakerOnIcon } from './icons';
import { generatePersonalizedSteps } from '../services/geminiService';
import Spinner from './Spinner';

interface CeremonyFlowProps {
  intention: string;
  onComplete: () => void;
}

const initialCeremonySteps: CeremonyStep[] = [
    {
        title: "Arrive",
        description: "Hold the bottle in both hands. If you feel comfortable, close your eyes and take three deep, slow breaths. Feel yourself arriving in this present moment."
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
        description: "Take your first sip. Drink it slowly, mindfully. Notice the rich flavours, the smooth texture, and its temperature. Feel the sensation as it fills you."
    },
    {
        title: "Savour",
        description: "Continue to drink your cacao without rush. Be fully present with each sip. This is a moment of nourishment for your body and being."
    },
    {
        title: "Connect",
        description: "Once finished, place your empty bottle aside. Gently bring your focus to your breath. Notice the sensations within you as you sit in silence for a few moments."
    },
    {
        title: "Reflection",
        description: "Gently open your eyes. Reflect on your experience. What feelings or insights arose? Carry this feeling of connection with you."
    }
];

const CeremonyFlow: React.FC<CeremonyFlowProps> = ({ intention, onComplete }) => {
  const [steps, setSteps] = useState<CeremonyStep[]>(initialCeremonySteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPersonalizing, setIsPersonalizing] = useState<boolean>(true);
  const { isAudioEnabled } = useAudio();
  
  const step = steps[currentStepIndex];
  const textToSpeak = step.title === 'Intention'
    ? `${step.description} Your stated intention is: "${intention}"`
    : step.description;
    
  const { play, stop, isPlaying, isLoading } = useTextToSpeech(textToSpeak);

  useEffect(() => {
    const personalizeCeremony = async () => {
        if (!intention) {
            setIsPersonalizing(false);
            return;
        }
        
        const personalizedData = await generatePersonalizedSteps(intention);
        
        if (personalizedData) {
            setSteps(prevSteps => 
                prevSteps.map(s => {
                    if (s.title === 'Savour') {
                        return { ...s, description: personalizedData.savourDescription };
                    }
                    if (s.title === 'Connect') {
                        return { ...s, description: personalizedData.connectDescription };
                    }
                    return s;
                })
            );
        }
        // If personalizedData is null, we just use the defaults.
        setIsPersonalizing(false);
    };

    personalizeCeremony();
  }, [intention]);


  useEffect(() => {
    if (isAudioEnabled && !isPersonalizing) {
      play();
    } else {
      stop();
    }
  }, [currentStepIndex, isAudioEnabled, play, stop, isPersonalizing]);

  const handleNext = () => {
    stop();
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrev = () => {
    stop();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  if (isPersonalizing) {
    return (
        <Card>
            <div className="text-center p-8 flex flex-col items-center justify-center min-h-[300px]">
                <Spinner />
                <p className="text-[#e4d5b7] mt-4 animate-fade-in">Personalising your ceremony...</p>
            </div>
        </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full w-full">
      <div className="flex-grow text-center relative">
        <p className="text-sm uppercase tracking-widest text-[#e4d5b7]/70 mb-2">Step {currentStepIndex + 1} of {steps.length}</p>
        <div className="flex items-center justify-center gap-4">
            <h2 className="text-4xl font-bold text-white mb-6">{step.title}</h2>
             {(isPlaying || isLoading) && isAudioEnabled && (
                <SpeakerOnIcon className="w-7 h-7 text-[#e4d5b7] animate-pulse mb-6" />
            )}
        </div>
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
                className="flex-1 bg-transparent border border-[#e4d5b7] text-[#e4d5b7] font-bold py-3 px-6 rounded-lg hover:bg-[#e4d5b7]/10 transition-transform transform hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
            >
                Previous
            </button>
            <button
                onClick={handleNext}
                className="flex-1 bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105 active:scale-95"
            >
                {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
        </div>
      </div>
    </Card>
  );
};

export default CeremonyFlow;