import React, { useState, useCallback } from 'react';
import { Screen } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import IntentionScreen from './components/IntentionScreen';
import PreparationScreen from './components/PreparationScreen';
import CeremonyFlow from './components/CeremonyFlow';
import ClosingScreen from './components/ClosingScreen';
import { JoinLogoIcon } from './components/icons';
import AudioToggleButton from './components/AudioToggleButton';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>(Screen.Welcome);
  const [intention, setIntention] = useState<string>('');


  const handleStart = () => {
    setScreen(Screen.Intention);
  };

  const handleIntentionSet = (newIntention: string) => {
    setIntention(newIntention);
    setScreen(Screen.Preparation);
  };

  const handlePreparationDone = () => {
    setScreen(Screen.Ceremony);
  };

  const handleCeremonyEnd = () => {
    setScreen(Screen.Closing);
  };

  const handleRestart = () => {
    setIntention('');
    setScreen(Screen.Welcome);
  };

  const renderScreen = useCallback(() => {
    switch (screen) {
      case Screen.Welcome:
        return <WelcomeScreen onStart={handleStart} />;
      case Screen.Intention:
        return <IntentionScreen onIntentionSet={handleIntentionSet} />;
      case Screen.Preparation:
        return <PreparationScreen onReady={handlePreparationDone} />;
      case Screen.Ceremony:
        return <CeremonyFlow onComplete={handleCeremonyEnd} intention={intention} />;
      case Screen.Closing:
        return <ClosingScreen onRestart={handleRestart} intention={intention} />;
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  }, [screen, intention]);

  return (
    <div className="min-h-screen bg-[#4a3a32] text-[#fdf5e6] flex flex-col items-center p-4">
        <header className="fixed top-0 left-0 w-full p-6 flex items-center justify-between z-10 bg-[#4a3a32]/80 backdrop-blur-sm">
            <div className="flex items-center">
                <JoinLogoIcon className="w-8 h-8 text-[#e4d5b7]" />
                <h1 className="text-xl font-bold text-[#e4d5b7] ml-3 tracking-widest">Join Cacao's Guide</h1>
            </div>
            <AudioToggleButton />
        </header>
        <main className="w-full max-w-lg mx-auto flex-grow flex items-center justify-center pt-20 pb-28">
            <div key={screen} className="w-full">
              {renderScreen()}
            </div>
        </main>
        {intention && (screen === Screen.Preparation || screen === Screen.Ceremony || screen === Screen.Closing) && (
             <footer className="fixed bottom-0 left-0 w-full bg-[#4a3a32]/80 backdrop-blur-sm p-4 text-center border-t border-white/10 animate-fade-in z-10">
                <p className="text-xs text-[#e4d5b7]/80 uppercase tracking-wider mb-1">Your Intention</p>
                <p className="text-white font-serif italic text-lg max-w-prose mx-auto">"{intention}"</p>
            </footer>
        )}
    </div>
  );
};

export default App;