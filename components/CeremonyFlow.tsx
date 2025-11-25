import React, { useState, useEffect } from 'react';
import type { CeremonyStep } from '../types';
import Card from './Card';
import { useAudio } from '../context/AudioContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { SpeakerOnIcon, TrianglePhaseIcon } from './icons';
import { generatePersonalizedSteps } from '../services/geminiService';
import Spinner from './Spinner';

interface CeremonyFlowProps {
  intention: string;
  onComplete: () => void;
}

type Phase = 'pause' | 'open' | 'discover';

const initialCeremonySteps: CeremonyStep[] = [
    // Phase 1: PAUSE
    {
        title: "Arrive",
        description: "Hold the bottle in both hands. If you feel comfortable, close your eyes and take three deep, slow breaths. Feel yourself arriving in this present moment."
    },
    {
        title: "Gratitude",
        description: "Feel the glass in your hands. Silently give thanks for this moment, the Earth, and all the hands that brought this cacao to you."
    },
    // Phase 2: OPEN
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
    // Phase 3: DISCOVER
    {
        title: "Connect",
        description: "Once finished, place your empty bottle aside. Gently bring your focus to your breath. Notice the sensations within you as you sit in silence for a few moments."
    },
    {
        title: "Reflection",
        description: "Gently open your eyes. Reflect on your experience. What feelings or insights arose? Carry this feeling of connection with you."
    }
];

const getPhase = (index: number): Phase => {
    if (index < 2) return 'pause';
    if (index < 5) return 'open';
    return 'discover';
}

const getPhaseTitle = (phase: Phase): string => {
    switch(phase) {
        case 'pause': return 'Phase 1: Pause';
        case 'open': return 'Phase 2: Open';
        case 'discover': return 'Phase 3: Discover';
    }
}

const getPhaseDescription = (phase: Phase): string => {
    switch(phase) {
        case 'pause': return 'Ground yourself in the moment.';
        case 'open': return 'Open your heart to the medicine.';
        case 'discover': return 'Discover what lies within.';
    }
}

const CeremonyFlow: React.FC<CeremonyFlowProps> = ({ intention, onComplete }) => {
  const [steps, setSteps] = useState<CeremonyStep[]>(initialCeremonySteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPersonalizing, setIsPersonalizing] = useState<boolean>(true);
  const [introPhase, setIntroPhase] = useState<Phase | null>('pause'); // Start with Pause intro
  
  const { isAudioEnabled } = useAudio();
  
  const step = steps[currentStepIndex];
  const currentPhase = getPhase(currentStepIndex);
  
  const textToSpeak = step.title === 'Intention'
    ? `${step.description} Your stated intention is: "${intention}"`
    : step.description;
    
  const { play, stop, isPlaying, isLoading } = useTextToSpeech(textToSpeak);

  // Personalize steps on mount
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
        setIsPersonalizing(false);
    };

    personalizeCeremony();
  }, [intention]);

  // Handle Phase Intro Timer
  useEffect(() => {
    if (introPhase) {
        const timer = setTimeout(() => {
            setIntroPhase(null);
        }, 2500); // Show intro for 2.5 seconds
        return () => clearTimeout(timer);
    }
  }, [introPhase]);

  // Audio Playback Control
  useEffect(() => {
    if (isAudioEnabled && !isPersonalizing && !introPhase) {
      play();
    } else {
      stop();
    }
  }, [currentStepIndex, isAudioEnabled, play, stop, isPersonalizing, introPhase]);

  const handleNext = () => {
    stop();
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextPhase = getPhase(nextIndex);
      
      if (nextPhase !== currentPhase) {
          setIntroPhase(nextPhase);
      }
      setCurrentStepIndex(nextIndex);
    } else {
      onComplete();
    }
  };
  
  const handlePrev = () => {
    stop();
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      // We don't usually show the intro when going backwards, keeps flow smoother
      setCurrentStepIndex(prevIndex);
    }
  }

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

  // Phase Transition Screen
  if (introPhase) {
      return (
        <Card className="flex flex-col h-full w-full justify-center items-center">
            <div className="text-center animate-fade-in">
                 <TrianglePhaseIcon phase={introPhase} className="w-24 h-24 mx-auto text-[#e4d5b7] mb-6 animate-soft-pulse" />
                 <h2 className="text-4xl font-bold text-white mb-2">{getPhaseTitle(introPhase)}</h2>
                 <p className="text-[#e4d5b7] text-lg italic">{getPhaseDescription(introPhase)}</p>
            </div>
        </Card>
      );
  }

  return (
    <Card className="flex flex-col h-full w-full relative">
      <div className="flex-grow text-center relative flex flex-col items-center">
        
        {/* Visual Anchor - The Logo */}
        <div className="mb-6 mt-2 relative">
             <TrianglePhaseIcon phase={currentPhase} className="w-20 h-20 text-[#e4d5b7] animate-soft-pulse" />
        </div>

        <p className="text-sm uppercase tracking-widest text-[#e4d5b7]/70 mb-1">{getPhaseTitle(currentPhase)}</p>
        
        <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-white">{step.title}</h2>
             {(isPlaying || isLoading) && isAudioEnabled && (
                <SpeakerOnIcon className="w-6 h-6 text-[#e4d5b7] animate-pulse" />
            )}
        </div>

        <div className="relative w-full max-w-sm">
            <p className="text-[#e4d5b7] text-xl leading-relaxed min-h-[120px]">
              {step.description}
               {step.title === 'Intention' && (
                  <span className="block font-serif italic text-white mt-4 border-t border-white/10 pt-4">"{intention}"</span>
              )}
            </p>
        </div>
      </div>

      <div className="mt-6 w-full">
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