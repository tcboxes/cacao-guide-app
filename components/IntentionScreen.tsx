import React, { useState } from 'react';
import { generateIntentions } from '../services/geminiService';
import Card from './Card';
import Spinner from './Spinner';
import { SparkleIcon, TrashIcon } from './icons';
import { useSavedIntentions } from '../hooks/useSavedIntentions';

interface IntentionScreenProps {
  onIntentionSet: (intention: string) => void;
}

const themes = ['Self-love', 'Creativity', 'Grounding', 'Work'];

const IntentionScreen: React.FC<IntentionScreenProps> = ({ onIntentionSet }) => {
  const [intention, setIntention] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedIntentions, setGeneratedIntentions] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined);

  const { savedIntentions, addIntention, removeIntention } = useSavedIntentions();

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedIntentions([]);
    const generated = await generateIntentions(selectedTheme);
    setGeneratedIntentions(generated);
    if (generated.length > 0) {
        setIntention(generated[0]);
    }
    setIsLoading(false);
  };

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setIntention(e.target.value);
  }

  const handleSetIntention = () => {
    const trimmedIntention = intention.trim();
    if (trimmedIntention) {
      addIntention(trimmedIntention);
      onIntentionSet(trimmedIntention);
    }
  };

  return (
    <Card>
        <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Set Your Intention</h2>
            <p className="text-[#e4d5b7] mb-6 text-lg">
                What is your purpose for this moment?
            </p>

            <div className="mb-4">
                <p className="text-[#e4d5b7] mb-3 text-sm">First, generate suggestions with a theme:</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {themes.map(theme => (
                        <button
                            key={theme}
                            onClick={() => setSelectedTheme(theme === selectedTheme ? undefined : theme)}
                            className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                selectedTheme === theme
                                    ? 'bg-[#e4d5b7] text-[#4a3a32] font-semibold shadow-md'
                                    : 'bg-transparent border border-[#e4d5b7] text-[#e4d5b7]'
                            }`}
                        >
                            {theme}
                        </button>
                    ))}
                </div>
                 <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full bg-transparent border border-[#e4d5b7] text-[#e4d5b7] font-bold py-3 px-6 rounded-lg hover:bg-[#e4d5b7]/10 transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Spinner /> : <><SparkleIcon className="w-5 h-5"/> {selectedTheme ? `Generate for ${selectedTheme}` : 'Generate Suggestions'}</>}
                </button>
            </div>
            
            {isLoading && !generatedIntentions.length && <div className="my-4"><Spinner /></div>}

            {generatedIntentions.length > 0 && !isLoading && (
                <div className="my-4 animate-fade-in">
                     <label htmlFor="intention-select" className="block text-sm text-[#e4d5b7] mb-2">Choose a suggestion:</label>
                     <select
                        id="intention-select"
                        value={intention}
                        onChange={handleSelectionChange}
                        className="w-full bg-[#6f5e53] text-white rounded-lg px-4 py-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#e4d5b7] transition-all cursor-pointer"
                     >
                        <option value="" disabled>Select a suggestion...</option>
                        {generatedIntentions.map((genIntention, index) => (
                            <option key={index} value={genIntention}>
                                {genIntention}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#6f5e53] px-3 text-sm uppercase tracking-wider text-[#e4d5b7]">OR</span>
              </div>
            </div>

            <div className="mb-4 text-left">
                 <label htmlFor="custom-intention" className="block text-sm text-[#e4d5b7] mb-2">Write your own:</label>
                <div className="relative">
                    <textarea
                        id="custom-intention"
                        value={intention}
                        onChange={(e) => setIntention(e.target.value)}
                        placeholder="e.g., To open my heart to gratitude..."
                        className="w-full h-28 bg-[#6f5e53] text-white placeholder-[#e4d5b7]/70 rounded-lg p-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#e4d5b7] transition-all"
                    />
                </div>
            </div>

            {savedIntentions.length > 0 && (
                <div className="animate-fade-in">
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#6f5e53] px-3 text-sm uppercase tracking-wider text-[#e4d5b7]">Your Past Intentions</span>
                        </div>
                    </div>
                    <div className="past-intentions-list max-h-36 overflow-y-auto pr-2 flex flex-wrap justify-start gap-2 mb-4">
                        {savedIntentions.map((saved, index) => (
                            <div key={index} className="group relative">
                                <button
                                    onClick={() => setIntention(saved)}
                                    className="bg-[#6f5e53]/80 text-[#e4d5b7] py-2 pl-4 pr-10 rounded-full hover:bg-[#6f5e53] transition-colors text-sm"
                                >
                                    {saved}
                                </button>
                                <button
                                    onClick={() => removeIntention(saved)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#e4d5b7]/50 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                                    aria-label={`Remove intention: ${saved}`}
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={handleSetIntention}
                    disabled={!intention.trim()}
                    className="w-full bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Set My Intention
                </button>
            </div>
        </div>
    </Card>
  );
};

export default IntentionScreen;