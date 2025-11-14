import React, { useState, useEffect } from 'react';
import Card from './Card';
import { HeartIcon, ExternalLinkIcon, InstagramIcon } from './icons';
import { generateClosingAffirmation } from '../services/geminiService';
import Spinner from './Spinner';

interface ClosingScreenProps {
  onRestart: () => void;
  intention: string;
}

const ClosingScreen: React.FC<ClosingScreenProps> = ({ onRestart, intention }) => {
  const [affirmation, setAffirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    const fetchAffirmation = async () => {
      setIsLoading(true);
      const generatedAffirmation = await generateClosingAffirmation(intention);
      setAffirmation(generatedAffirmation);
      setIsLoading(false);
    };

    fetchAffirmation();
  }, [intention]);

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (showComingSoon) return;
    setShowComingSoon(true);
    setTimeout(() => {
        setShowComingSoon(false);
    }, 3000);
  };

  return (
    <Card>
      <div className="text-center">
        <HeartIcon className="w-16 h-16 mx-auto text-[#e4d5b7] mb-4"/>
        <h2 className="text-4xl font-bold text-white mb-4">Ceremony Complete</h2>
        
        <div className="min-h-[6rem] flex items-center justify-center my-4 p-4 bg-[#6f5e53]/50 rounded-lg">
          {isLoading ? (
            <Spinner />
          ) : (
            <p className="text-white font-serif italic text-xl animate-fade-in">
              "{affirmation}"
            </p>
          )}
        </div>
        
        <div className="my-8 text-left animate-fade-in">
          <label htmlFor="journal-prompt" className="block text-sm text-center text-[#e4d5b7] mb-3">
            A moment to reflect...
          </label>
          <textarea
            id="journal-prompt"
            placeholder="What one word describes how you feel now?"
            className="w-full h-24 bg-[#6f5e53] text-white placeholder-[#e4d5b7]/70 rounded-lg p-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#e4d5b7] transition-all"
          />
        </div>

        <button
            onClick={onRestart}
            className="w-full bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105 active:scale-95"
        >
          Begin Another Ceremony
        </button>

        <div className="mt-8 pt-6 border-t border-white/10 text-center relative">
             <button
                onClick={handleExploreClick}
                className="w-full bg-transparent border border-[#e4d5b7] text-[#e4d5b7] font-bold py-3 px-6 rounded-lg hover:bg-[#e4d5b7]/10 transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mb-4"
            >
                <ExternalLinkIcon className="w-5 h-5" />
                Explore Our Offerings
            </button>
            {showComingSoon && (
                <p className="text-xs text-white/90 animate-fade-in mb-4 absolute w-full -bottom-1 left-0">
                    Coming Soon!
                </p>
            )}
            <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-2 text-[#e4d5b7]/80 hover:text-[#e4d5b7] transition-colors mt-2">
                <InstagramIcon className="w-5 h-5" />
                <span className="text-sm">Follow the Journey</span>
            </a>
        </div>
      </div>
    </Card>
  );
};

export default ClosingScreen;