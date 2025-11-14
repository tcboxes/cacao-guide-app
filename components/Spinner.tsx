import React from 'react';
import { CacaoPodIcon } from './icons';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <CacaoPodIcon className="w-10 h-10 text-[#e4d5b7] animate-soft-pulse" />
    </div>
  );
};

export default Spinner;