import React, { useState } from 'react';
import { generateIntentions } from '../services/geminiService';
import Card from './Card';
import Spinner from './Spinner';
import { SparkleIcon } from './icons';

interface IntentionScreenProps {
  onIntentionSet: (intention: string) => void;
}

const themes = ['Self-love', 'Creativity', 'Grounding', 'Work'];

const IntentionScreen: React.FC<IntentionScreenProps> = ({ onIntentionSet }) => {
  const [intention, setIntention] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedIntentions, setGeneratedIntentions] = useState<string[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(undefined);

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
                            className={`px-4 py-1.5 text-sm rounded-full transition-all duration-300 transform hover:scale-105 ${
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
                    className="w-full bg-transparent border border-[#e4d5b7] text-[#e4d5b7] font-bold py-3 px-6 rounded-lg hover:bg-[#e4d5b7]/10 transition-transform transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Spinner /> : <><SparkleIcon className="w-5 h-5"/> {selectedTheme ? `Generate for ${selectedTheme}` : 'Generate Suggestions'}</>}
                </button>
            </div>
            
            {isLoading && <div className="my-4"><Spinner /></div>}

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

            <div className="mb-4">
                 <label htmlFor="custom-intention" className="block text-sm text-[#e4d5b7] mb-2">Write your own:</label>
                <textarea
                    id="custom-intention"
                    value={intention}
                    onChange={(e) => setIntention(e.target.value)}
                    placeholder="e.g., To open my heart to gratitude..."
                    className="w-full h-28 bg-[#6f5e53] text-white placeholder-[#e4d5b7]/70 rounded-lg p-4 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#e4d5b7] transition-all"
                />
            </div>

            <div className="mt-6">
                <button
                    onClick={() => onIntentionSet(intention)}
                    disabled={!intention.trim()}
                    className="w-full bg-[#e4d5b7] text-[#4a3a32] font-bold py-3 px-6 rounded-lg hover:bg-white/90 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Set My Intention
                </button>
            </div>
        </div>
    </Card>
  );
};

export default IntentionScreen;