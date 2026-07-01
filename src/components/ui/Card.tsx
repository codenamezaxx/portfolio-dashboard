'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <div className={`
      border border-line bg-surface-card
      ${hoverEffect ? 'transition-colors duration-200 hover:bg-[rgba(255,255,255,0.5)]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default Card;
