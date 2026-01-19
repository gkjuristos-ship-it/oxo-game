'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeColors {
  // Main colors
  primary: string;      // Main accent (Base Blue)
  primaryDim: string;   // Dimmed primary
  primaryGlow: string;  // Glow effect
  
  // Backgrounds
  bgMain: string;       // Main background
  bgPanel: string;      // Panel background
  bgScreen: string;     // Screen background
  bgInput: string;      // Input background
  
  // Borders & accents
  border: string;
  borderLight: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  
  // Game-specific colors
  playerX: string;      // Human player X marks
  playerO: string;      // AI player O marks
  
  // Special
  metalLight: string;
  metalDark: string;
  
  // Border radius
  radiusSm: string;
  radiusMd: string;
  radiusLg: string;
  radiusXl: string;
}

// Dark theme - Green phosphor CRT + Base backgrounds
const darkTheme: ThemeColors = {
  primary: '#33ff33',           // Green phosphor
  primaryDim: '#1a8a1a',        // Darker green
  primaryGlow: 'rgba(51,255,51,0.4)',
  
  bgMain: '#0a0b0d',            // Base Gray 100
  bgPanel: '#1a1c20',           // Between 80-100
  bgScreen: '#0f1012',          // Slightly lighter than main
  bgInput: '#1a1c20',
  
  border: '#32353d',            // Base Gray 80
  borderLight: '#5b616e',       // Base Gray 60
  
  textPrimary: '#33ff33',       // Green
  textSecondary: '#1a8a1a',     // Dim green
  textMuted: '#717886',         // Base Gray 50
  
  success: '#33ff33',           // Green
  warning: '#ffd12f',           // Base Yellow
  error: '#fc401f',             // Base Red
  
  playerX: '#33ff33',           // Green for human X
  playerO: '#fc401f',           // Red for AI O
  
  metalLight: '#5b616e',        // Base Gray 60
  metalDark: '#32353d',         // Base Gray 80
  
  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '16px',
  radiusXl: '24px',
};

// Light theme - Base inspired clean white
const lightTheme: ThemeColors = {
  primary: '#0052ff',           // Base Blue
  primaryDim: '#3c8aff',        // Cerulean
  primaryGlow: 'rgba(0,82,255,0.3)',
  
  bgMain: '#ffffff',            // Gray 0
  bgPanel: '#eef0f3',           // Gray 10
  bgScreen: '#f8f9fb',          // Between 0-10
  bgInput: '#ffffff',
  
  border: '#dee1e7',            // Gray 15
  borderLight: '#b1b7c3',       // Gray 30
  
  textPrimary: '#0a0b0d',       // Gray 100
  textSecondary: '#5b616e',     // Gray 60
  textMuted: '#717886',         // Gray 50
  
  success: '#66c800',           // Base Green
  warning: '#ffd12f',           // Base Yellow
  error: '#fc401f',             // Base Red
  
  playerX: '#001f66',           // Dark navy blue - high contrast for human X
  playerO: '#cc3318',           // Dark red for AI O
  
  metalLight: '#dee1e7',        // Gray 15
  metalDark: '#b1b7c3',         // Gray 30
  
  radiusSm: '8px',
  radiusMd: '12px',
  radiusLg: '16px',
  radiusXl: '24px',
};

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: darkTheme,
  toggleTheme: () => {},
  isDark: true,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');

  // Load saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('oxo-theme') as Theme | null;
    if (saved && (saved === 'dark' || saved === 'light')) {
      setTheme(saved);
    }
  }, []);

  // Save theme to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('oxo-theme', newTheme);
  };

  const colors = theme === 'dark' ? darkTheme : lightTheme;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Theme toggle button component
export function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();
  
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleTheme();
      }}
      className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${colors.metalLight}, ${colors.metalDark})`,
        border: `3px solid ${colors.primary}`,
        boxShadow: `0 0 12px ${colors.primaryGlow}, 0 4px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)`,
      }}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
    >
      <span 
        className="text-xl"
        style={{ 
          color: colors.primary,
          textShadow: `0 0 8px ${colors.primaryGlow}`,
        }}
      >
        {isDark ? '☀' : '☾'}
      </span>
    </button>
  );
}
