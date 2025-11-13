import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-[#6f5e53]/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/10 transition-all duration-500 animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
