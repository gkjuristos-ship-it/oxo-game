'use client';

import { useState, useEffect } from 'react';
import SwipeNavigation from '@/components/SwipeNavigation';
import HistoryScreen from '@/components/HistoryScreen';
import GameScreen from '@/components/GameScreen';
import OnlineScreen from '@/components/OnlineScreen';

export default function OXOApp() {
  const [booted, setBooted] = useState(false);
  const [bootPhase, setBootPhase] = useState(0);

  // Boot sequence
  useEffect(() => {
    const phases = [
      { delay: 0, phase: 1 },
      { delay: 300, phase: 2 },
      { delay: 600, phase: 3 },
      { delay: 900, phase: 4 },
      { delay: 1500, phase: 5 },
    ];
    
    phases.forEach(({ delay, phase }) => {
      setTimeout(() => setBootPhase(phase), delay);
    });
    
    const bootTimer = setTimeout(() => setBooted(true), 2000);
    return () => clearTimeout(bootTimer);
  }, []);

  // Экран загрузки
  if (!booted) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#33ff33] text-xl mb-6 font-mono tracking-wider" style={{ textShadow: '0 0 10px rgba(51,255,51,0.5)' }}>
            EDSAC INITIALIZATION
          </div>
          
          {/* Индикаторы загрузки */}
          <div className="flex flex-col gap-2 mb-6 text-left font-mono text-sm">
            <div className={`transition-opacity ${bootPhase >= 1 ? 'text-[#33ff33]' : 'text-[#1a3a1a]'}`}>
              {bootPhase >= 1 ? '✓' : '○'} MEMORY CHECK....... OK
            </div>
            <div className={`transition-opacity ${bootPhase >= 2 ? 'text-[#33ff33]' : 'text-[#1a3a1a]'}`}>
              {bootPhase >= 2 ? '✓' : '○'} VACUUM TUBES....... OK
            </div>
            <div className={`transition-opacity ${bootPhase >= 3 ? 'text-[#33ff33]' : 'text-[#1a3a1a]'}`}>
              {bootPhase >= 3 ? '✓' : '○'} MERCURY DELAY...... OK
            </div>
            <div className={`transition-opacity ${bootPhase >= 4 ? 'text-[#33ff33]' : 'text-[#1a3a1a]'}`}>
              {bootPhase >= 4 ? '✓' : '○'} AI ALGORITHM....... LOADED
            </div>
            <div className={`transition-opacity ${bootPhase >= 5 ? 'text-[#ffff33]' : 'text-[#1a3a1a]'}`}>
              {bootPhase >= 5 ? '▶' : '○'} STARTING OXO PROGRAM
            </div>
          </div>
          
          {/* Мигающие индикаторы */}
          <div className="flex gap-2 justify-center">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.1}s`,
                  backgroundColor: i < bootPhase * 2 ? '#33ff33' : '#1a3a1a',
                  boxShadow: i < bootPhase * 2 ? '0 0 8px #33ff33' : 'none'
                }}
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="h-screen bg-[#0a0a0a] overflow-hidden">
      <SwipeNavigation initialIndex={1}>
        <HistoryScreen />
        <GameScreen />
        <OnlineScreen />
      </SwipeNavigation>
    </main>
  );
}
