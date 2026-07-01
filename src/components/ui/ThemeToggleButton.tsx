'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';

const ThemeToggleButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 p-0 flex items-center justify-center border border-line hover:bg-white/20 transition-colors cursor-pointer"
      title="Switch theme"
      aria-label="Switch theme"
    >
      {theme === 'light' ? <Moon className="w-4 h-4" style={{color: 'var(--accent)'}} /> : <Sun className="w-4 h-4" style={{color: 'var(--accent)'}} />}
    </button>
  );
};

export default ThemeToggleButton;