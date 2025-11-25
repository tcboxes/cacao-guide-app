import React from 'react';
import { JoinLogoIcon } from './icons';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <JoinLogoIcon className="w-10 h-10 text-[#e4d5b7] animate-soft-pulse" />
    </div>
  );
};

export default Spinner;