'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  Board, 
  findBestMove, 
  isGameOver,
  GameResult,
  getGameResult,
  Difficulty,
  DIFFICULTY_NAMES
} from '@/lib/minimax';
import {
  playDialClick,
  playDialReturn,
  playPlayerMove,
  playComputerMove,
  playWin,
  playLose,
  playDraw,
  playBootSequence,
  playProcessing,
  playButtonPress,
  playKnobClick,
  initAudio
} from '@/lib/sounds';
import { useTheme, ThemeToggle } from '@/lib/theme';
import { useI18n, LanguageToggle } from '@/lib/i18n';

const initialBoard: Board = Array(9).fill(null);

interface GameScreenProps {
  onFirstInteraction?: () => void;
}

export default function GameScreen({ onFirstInteraction }: GameScreenProps) {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [board, setBoard] = useState<Board>(initialBoard);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, games: 0 });
  const [isThinking, setIsThinking] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(5);
  const [volume, setVolume] = useState(3);
  const [selectedDial, setSelectedDial] = useState<number | null>(null);
  const [dialRotation, setDialRotation] = useState(0);
  const [audioInitialized, setAudioInitialized] = useState(false);
  
  const dialRef = useRef<HTMLDivElement>(null);

  const handleFirstInteraction = useCallback(() => {
    if (!audioInitialized) {
      initAudio();
      setAudioInitialized(true);
      onFirstInteraction?.();
    }
  }, [audioInitialized, onFirstInteraction]);

  // Dial selection
  const handleDialSelect = useCallback((position: number) => {
    if (board[position] !== null || !isPlayerTurn || gameResult !== null) return;
    
    handleFirstInteraction();
    if (volume > 0) {
      playDialClick();
      setTimeout(() => {
        if (volume > 0) playDialReturn();
      }, 100);
    }
    
    setSelectedDial(position);
    const targetRotation = (position + 1) * 36;
    setDialRotation(targetRotation);
    
    setTimeout(() => {
      const newBoard = [...board];
      newBoard[position] = 'X';
      setBoard(newBoard);
      setIsPlayerTurn(false);
      setSelectedDial(null);
      setDialRotation(0);
      if (volume > 0) playPlayerMove();
    }, 300);
  }, [board, isPlayerTurn, gameResult, volume, handleFirstInteraction]);

  const handleCellClick = useCallback((index: number) => {
    handleDialSelect(index);
  }, [handleDialSelect]);

  // AI turn
  useEffect(() => {
    if (isPlayerTurn || gameResult !== null) return;
    if (isGameOver(board)) return;

    setIsThinking(true);
    if (volume > 0) playProcessing();
    
    const thinkTime = 600 + Math.random() * 800;
    
    const timer = setTimeout(() => {
      const aiMove = findBestMove(board, 'O', difficulty);
      if (aiMove !== -1) {
        const newBoard = [...board];
        newBoard[aiMove] = 'O';
        setBoard(newBoard);
        if (volume > 0) playComputerMove();
      }
      setIsPlayerTurn(true);
      setIsThinking(false);
    }, thinkTime);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, board, gameResult, difficulty, volume]);

  // Check result
  useEffect(() => {
    const result = getGameResult(board, 'X');
    if (result !== null && gameResult === null) {
      setGameResult(result);
      setStats(prev => ({
        wins: prev.wins + (result === 'draw' || result === 'win' ? 1 : 0),
        losses: prev.losses + (result === 'lose' ? 1 : 0),
        games: prev.games + 1,
      }));
      
      if (volume > 0) {
        setTimeout(() => {
          if (result === 'win') playWin();
          else if (result === 'lose') playLose();
          else if (result === 'draw') playDraw();
        }, 200);
      }
    }
  }, [board, gameResult, volume]);

  const resetGame = () => {
    handleFirstInteraction();
    if (volume > 0) playButtonPress();
    setBoard(initialBoard);
    setIsPlayerTurn(true);
    setGameResult(null);
  };

  const changeDifficulty = () => {
    handleFirstInteraction();
    if (volume > 0) playKnobClick();
    setDifficulty(prev => (prev % 5 + 1) as Difficulty);
  };

  const changeVolume = () => {
    handleFirstInteraction();
    const newVol = (volume % 5) + 1;
    if (newVol > 0) playKnobClick();
    setVolume(newVol);
  };

  const playBootMusic = () => {
    handleFirstInteraction();
    if (volume > 0) playBootSequence(volume * 0.1);
  };

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: colors.bgMain }} onClick={handleFirstInteraction}>
      <div className="relative w-[320px] max-w-full" style={{ borderRadius: colors.radiusXl, overflow: 'hidden' }}>
        {/* Top panel */}
        <div className="p-3" style={{ 
          background: colors.bgPanel,
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div className="flex justify-between items-center">
            {/* Language toggle */}
            <div className="scale-75 origin-left">
              <LanguageToggle />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'animate-pulse' : ''}`} 
                     style={{ 
                       backgroundColor: isThinking ? colors.error : `${colors.error}30`,
                       boxShadow: isThinking ? `0 0 4px ${colors.error}` : 'none' 
                     }} />
                <span className="text-[7px] font-mono" style={{ color: colors.textMuted }}>PROC</span>
              </div>
              <div className="text-[8px] tracking-[0.15em] font-mono" style={{ color: colors.textMuted }}>
                {t('game.computing_machine')}
              </div>
              <div className="flex gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isPlayerTurn && !gameResult ? 'animate-pulse' : ''}`}
                     style={{ 
                       backgroundColor: isPlayerTurn && !gameResult ? colors.success : colors.primaryDim,
                       boxShadow: isPlayerTurn && !gameResult ? `0 0 4px ${colors.success}` : 'none' 
                     }} />
                <span className="text-[7px] font-mono" style={{ color: colors.textMuted }}>RDY</span>
              </div>
            </div>
            
            {/* Theme toggle */}
            <div className="scale-75 origin-right">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Screen */}
        <div className="p-4" style={{ 
          background: colors.bgScreen,
          border: `1px solid ${colors.border}`,
        }}>
          <div className="p-4 relative" style={{ backgroundColor: colors.bgScreen, borderRadius: colors.radiusMd }}>
            {/* Title */}
            <div className="text-center mb-2">
              <h1 className="text-3xl md:text-4xl tracking-[0.3em] font-mono" 
                  style={{ color: colors.primary, textShadow: `0 0 15px ${colors.primaryGlow}` }}>
                {t('game.title')}
              </h1>
              <div className="text-[10px] tracking-[0.4em] font-mono" style={{ color: colors.primaryDim }}>
                {t('game.subtitle')}
              </div>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-4 mb-2 text-xs font-mono">
              <div className="text-center">
                <div className="text-lg" style={{ color: colors.primary, textShadow: `0 0 8px ${colors.primaryGlow}` }}>
                  {stats.wins}
                </div>
                <div className="text-[9px]" style={{ color: colors.primaryDim }}>{t('game.wins')}</div>
              </div>
              <div className="text-center border-x px-3" style={{ borderColor: colors.primaryDim }}>
                <div className="text-lg" style={{ color: colors.primary, textShadow: `0 0 8px ${colors.primaryGlow}` }}>
                  {stats.games}
                </div>
                <div className="text-[9px]" style={{ color: colors.primaryDim }}>{t('game.games')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg" style={{ color: colors.error, textShadow: `0 0 8px ${colors.error}` }}>
                  {stats.losses}
                </div>
                <div className="text-[9px]" style={{ color: colors.error }}>{t('game.losses')}</div>
              </div>
            </div>

            {/* Game board */}
            <div className="flex justify-center mb-2">
              <div className="grid grid-cols-3 gap-0 border-2" style={{ borderColor: colors.primary, boxShadow: `0 0 15px ${colors.primaryGlow}` }}>
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={cell !== null || !isPlayerTurn || gameResult !== null}
                    className="w-14 h-14 md:w-16 md:h-16 text-3xl md:text-4xl font-mono font-bold border transition-all duration-100"
                    style={{
                      borderColor: colors.primaryDim,
                      color: cell === 'X' ? colors.playerX : cell === 'O' ? colors.playerO : colors.primaryDim,
                      textShadow: cell ? `0 0 12px ${cell === 'X' ? colors.playerX : colors.playerO}40` : 'none',
                      backgroundColor: selectedDial === index ? colors.primaryDim : 'transparent',
                      cursor: cell === null && isPlayerTurn && !gameResult ? 'pointer' : 'default',
                    }}
                  >
                    {cell || (index + 1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="text-center h-5 font-mono text-xs">
              {gameResult === 'draw' && (
                <div className="animate-pulse" style={{ color: colors.primary, textShadow: `0 0 12px ${colors.primaryGlow}` }}>
                  ◆ {t('game.draw')} ◆
                </div>
              )}
              {gameResult === 'win' && (
                <div style={{ color: colors.warning, textShadow: `0 0 12px ${colors.warning}` }}>
                  ◆ {t('game.victory')} ◆
                </div>
              )}
              {gameResult === 'lose' && (
                <div style={{ color: colors.error, textShadow: `0 0 12px ${colors.error}` }}>
                  ◆ {t('game.machine_wins')} ◆
                </div>
              )}
              {!gameResult && isThinking && (
                <div style={{ color: colors.warning }}>{t('game.computing')}<span className="animate-pulse">...</span></div>
              )}
              {!gameResult && isPlayerTurn && !isThinking && (
                <div style={{ color: colors.primary }}>{t('game.dial')}<span className="animate-pulse">_</span></div>
              )}
            </div>

            <div className="text-center text-[9px] font-mono tracking-wider" style={{ color: colors.primaryDim }}>
              {t('game.draw_human')}
            </div>
          </div>
        </div>

        {/* Rotary dial */}
        <div className="p-3" style={{ 
          background: colors.bgPanel,
          borderTop: `1px solid ${colors.border}`,
        }}>
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-[9px] tracking-wider mb-1 font-mono text-center" style={{ color: colors.textMuted }}>
                {t('game.rotary_input')}
              </div>
              
              <div 
                ref={dialRef}
                className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 shadow-lg relative transition-transform duration-300"
                style={{ 
                  background: colors.bgPanel,
                  borderColor: colors.border,
                  transform: `rotate(${dialRotation}deg)`,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.2)`
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => {
                  const angle = (index * 36) - 144;
                  const rad = (angle * Math.PI) / 180;
                  const x = 50 + 35 * Math.cos(rad);
                  const y = 50 + 35 * Math.sin(rad);
                  const isAvailable = board[index] === null && isPlayerTurn && !gameResult;
                  
                  return (
                    <button
                      key={num}
                      onClick={() => handleDialSelect(index)}
                      disabled={!isAvailable}
                      className="absolute w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-mono text-xs md:text-sm font-bold transition-all duration-100 border-2"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: `translate(-50%, -50%) rotate(-${dialRotation}deg)`,
                        backgroundColor: isAvailable ? colors.bgMain : colors.bgPanel,
                        color: isAvailable ? colors.primary : colors.textMuted,
                        borderColor: isAvailable ? colors.border : colors.bgPanel,
                        cursor: isAvailable ? 'pointer' : 'default',
                        textShadow: isAvailable ? `0 0 4px ${colors.primaryGlow}` : 'none'
                      }}
                    >
                      {num}
                    </button>
                  );
                })}
                
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 flex items-center justify-center"
                     style={{ 
                       background: colors.bgScreen,
                       borderColor: colors.border,
                     }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }} />
                </div>
                
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-6 rounded-r-full border-2"
                     style={{ backgroundColor: colors.bgPanel, borderColor: colors.border }} />
              </div>
            </div>
          </div>
        </div>

        {/* Control panel */}
        <div className="p-3" style={{ 
          background: colors.bgPanel,
          borderTop: `1px solid ${colors.border}`,
        }}>
          <div className="flex justify-between items-end gap-2">
            
            {/* Difficulty */}
            <div className="flex flex-col items-center">
              <div className="text-[8px] tracking-wider mb-1 font-mono" style={{ color: colors.textMuted }}>{t('game.level')}</div>
              <div 
                className="w-12 h-12 rounded-full border-2 shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform relative"
                style={{ 
                  background: colors.bgScreen,
                  borderColor: colors.border,
                }}
                onClick={changeDifficulty}
              >
                <div className="absolute inset-0 pointer-events-none">
                  {[1,2,3,4,5].map((level) => {
                    const rotation = -135 + (level - 1) * 67.5;
                    const rad = rotation * Math.PI / 180;
                    const x = 50 + 42 * Math.sin(rad);
                    const y = 50 - 42 * Math.cos(rad);
                    return (
                      <div
                        key={level}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: level <= difficulty ? colors.primary : colors.metalDark,
                          boxShadow: level <= difficulty ? `0 0 4px ${colors.primary}` : 'none'
                        }}
                      />
                    );
                  })}
                </div>
                <div 
                  className="w-8 h-8 rounded-full border pointer-events-none transition-transform duration-200"
                  style={{ 
                    background: `linear-gradient(to bottom, ${colors.metalLight}, ${colors.metalDark})`,
                    borderColor: colors.metalDark,
                    transform: `rotate(${-135 + (difficulty - 1) * 67.5}deg)` 
                  }}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-3 rounded-full" style={{ top: '2px', backgroundColor: colors.bgScreen }} />
                </div>
              </div>
              <div className="text-[8px] mt-1 font-mono" style={{ color: colors.primary, textShadow: `0 0 4px ${colors.primaryGlow}` }}>
                {DIFFICULTY_NAMES[difficulty]}
              </div>
            </div>

            {/* Music */}
            <div className="flex flex-col items-center">
              <div className="text-[8px] tracking-wider mb-1 font-mono" style={{ color: colors.textMuted }}>{t('game.music')}</div>
              <button
                onClick={playBootMusic}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ 
                  background: `linear-gradient(to bottom, ${colors.metalLight}, ${colors.metalDark})`,
                  borderColor: colors.metalDark,
                }}
              >
                <span style={{ color: colors.primary }}>♪</span>
              </button>
            </div>

            {/* START */}
            <div className="flex flex-col items-center">
              <button onClick={resetGame} className="relative group">
                <div className="w-16 h-16 rounded-full border-4 shadow-lg flex items-center justify-center"
                     style={{ 
                       background: `linear-gradient(to bottom, ${colors.metalLight}, ${colors.metalDark})`,
                       borderColor: colors.metalDark,
                     }}>
                  <div className="w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all"
                       style={{ 
                         background: `linear-gradient(to bottom, ${colors.metalLight}, ${colors.metalDark})`,
                         borderColor: colors.border,
                       }}>
                    <span className="text-[9px] font-mono tracking-wider" style={{ color: colors.primary, textShadow: `0 0 4px ${colors.primaryGlow}` }}>
                      START
                    </span>
                  </div>
                </div>
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full" 
                     style={{ 
                       backgroundColor: gameResult ? colors.error : colors.success,
                       boxShadow: `0 0 6px ${gameResult ? colors.error : colors.success}` 
                     }} />
              </button>
              <div className="text-[8px] tracking-wider mt-1 font-mono" style={{ color: colors.textMuted }}>{t('game.new')}</div>
            </div>

            {/* Reset */}
            <div className="flex flex-col items-center">
              <div className="text-[8px] tracking-wider mb-1 font-mono" style={{ color: colors.textMuted }}>{t('game.reset')}</div>
              <button
                onClick={() => {
                  handleFirstInteraction();
                  if (volume > 0) playButtonPress();
                  setStats({ wins: 0, losses: 0, games: 0 });
                  resetGame();
                }}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all"
                style={{ 
                  background: `linear-gradient(to bottom, ${colors.error}40, ${colors.error}20)`,
                  borderColor: colors.metalDark,
                }}
              >
                <span style={{ color: colors.error }}>↺</span>
              </button>
            </div>

            {/* Volume */}
            <div className="flex flex-col items-center">
              <div className="text-[8px] tracking-wider mb-1 font-mono" style={{ color: colors.textMuted }}>{t('game.vol')}</div>
              <div 
                className="w-12 h-12 rounded-full border-3 shadow-lg flex items-center justify-center cursor-pointer active:scale-95 transition-transform relative"
                style={{ 
                  background: `linear-gradient(to bottom, ${colors.metalLight}, ${colors.metalDark})`,
                  borderColor: colors.metalDark,
                }}
                onClick={changeVolume}
              >
                <div className="absolute inset-0 pointer-events-none">
                  {[1,2,3,4,5].map((level) => {
                    const rotation = -135 + (level - 1) * 67.5;
                    const rad = rotation * Math.PI / 180;
                    const x = 50 + 42 * Math.sin(rad);
                    const y = 50 - 42 * Math.cos(rad);
                    return (
                      <div
                        key={level}
                        className="absolute w-1 h-1 rounded-full"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          backgroundColor: level <= volume ? colors.warning : colors.metalDark,
                          boxShadow: level <= volume ? `0 0 4px ${colors.warning}` : 'none'
                        }}
                      />
                    );
                  })}
                </div>
                <div 
                  className="w-8 h-8 rounded-full border pointer-events-none transition-transform duration-200"
                  style={{ 
                    background: `linear-gradient(to bottom, ${colors.metalLight}, ${colors.metalDark})`,
                    borderColor: colors.metalDark,
                    transform: `rotate(${-135 + (volume - 1) * 67.5}deg)` 
                  }}
                >
                  <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-3 rounded-full" style={{ top: '2px', backgroundColor: colors.bgScreen }} />
                </div>
              </div>
              <div className="text-[8px] mt-1 font-mono" style={{ color: colors.warning, textShadow: `0 0 4px ${colors.warning}` }}>
                {volume}/5
              </div>
            </div>
          </div>

          {/* Nameplate */}
          <div className="mt-3 text-center">
            <div className="inline-block px-4 py-2 rounded-full" style={{ 
              background: colors.bgScreen,
              border: `1px solid ${colors.border}`,
            }}>
              <div className="text-[8px] tracking-[0.1em] font-mono" style={{ color: colors.textMuted }}>
                CAMBRIDGE • EDSAC • 1952
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
