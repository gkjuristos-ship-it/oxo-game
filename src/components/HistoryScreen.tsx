'use client';

import { useState, useEffect } from 'react';
import { useTheme, ThemeToggle } from '@/lib/theme';
import { useI18n, LanguageToggle } from '@/lib/i18n';

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const [visibleSections, setVisibleSections] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleSections(prev => Math.min(prev + 1, 5));
    }, 300);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: colors.bgMain }}>
      <div className="max-w-lg w-full">
        {/* Card container */}
        <div style={{ 
          background: colors.bgPanel,
          borderRadius: colors.radiusXl,
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        }}>
          
          {/* Top panel with language/theme toggles */}
          <div className="p-3" style={{ 
            background: colors.bgPanel,
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <div className="flex justify-between items-center">
              <div className="scale-75 origin-left">
                <LanguageToggle />
              </div>
              <div className="text-[9px] tracking-[0.2em] font-mono" style={{ color: colors.textMuted }}>
                {t('history.title')}
              </div>
              <div className="scale-75 origin-right">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4" style={{ backgroundColor: colors.bgScreen }}>
            <div className="font-mono text-sm leading-relaxed space-y-4">
              
              {/* Header */}
              <div className={`transition-opacity duration-500 ${visibleSections >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className="text-2xl text-center mb-2 tracking-[0.3em]"
                    style={{ color: colors.primary }}>
                  {t('history.edsac')}
                </h1>
                <div className="text-center text-xs tracking-wider mb-4" style={{ color: colors.textSecondary }}>
                  ELECTRONIC DELAY STORAGE AUTOMATIC CALCULATOR
                </div>
                <div className="border-t my-3" style={{ borderColor: colors.border }} />
              </div>

              {/* Section 1: History */}
              <div className={`transition-opacity duration-500 ${visibleSections >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-xs mb-1 font-bold" style={{ color: colors.primary }}>▶ ORIGIN [1949]</div>
                <p className="text-xs pl-3" style={{ color: colors.textPrimary }}>
                  {t('history.about')}
                </p>
              </div>

              {/* Section 2: OXO */}
              <div className={`transition-opacity duration-500 ${visibleSections >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-xs mb-1 font-bold" style={{ color: colors.primary }}>▶ OXO [{t('history.year')}]</div>
                <p className="text-xs pl-3" style={{ color: colors.textPrimary }}>
                  {t('history.creator')}. {t('history.thesis')}.
                </p>
              </div>

              {/* Section 3: Legacy */}
              <div className={`transition-opacity duration-500 ${visibleSections >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-xs mb-1 font-bold" style={{ color: colors.primary }}>▶ LEGACY</div>
                <p className="text-xs pl-3" style={{ color: colors.textPrimary }}>
                  {t('history.first_game')} - {t('history.cambridge')}.
                </p>
              </div>

              {/* Section 4: Base Blockchain */}
              <div className={`transition-opacity duration-500 ${visibleSections >= 5 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="border-t my-3" style={{ borderColor: colors.border }} />
                <div className="text-xs mb-1 font-bold" style={{ color: colors.primary }}>▶ BASE BLOCKCHAIN</div>
                <div className="p-3" style={{ 
                  backgroundColor: colors.bgPanel, 
                  borderRadius: colors.radiusMd,
                  border: `1px solid ${colors.border}`,
                }}>
                  <p className="text-xs" style={{ color: colors.textPrimary }}>
                    FROM VACUUM TUBES TO BLOCKCHAIN
                  </p>
                </div>
              </div>

              {/* Technical specs */}
              <div className={`transition-opacity duration-500 ${visibleSections >= 5 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="border-t my-3" style={{ borderColor: colors.border }} />
                <div className="text-[10px] tracking-wider mb-2" style={{ color: colors.textMuted }}>SPECS:</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="flex justify-between p-2" style={{ backgroundColor: colors.bgPanel, borderRadius: colors.radiusSm }}>
                    <span style={{ color: colors.textMuted }}>MEMORY:</span>
                    <span style={{ color: colors.textPrimary }}>512 WORDS</span>
                  </div>
                  <div className="flex justify-between p-2" style={{ backgroundColor: colors.bgPanel, borderRadius: colors.radiusSm }}>
                    <span style={{ color: colors.textMuted }}>CLOCK:</span>
                    <span style={{ color: colors.textPrimary }}>500 KHZ</span>
                  </div>
                  <div className="flex justify-between p-2" style={{ backgroundColor: colors.bgPanel, borderRadius: colors.radiusSm }}>
                    <span style={{ color: colors.textMuted }}>TUBES:</span>
                    <span style={{ color: colors.textPrimary }}>3,000</span>
                  </div>
                  <div className="flex justify-between p-2" style={{ backgroundColor: colors.bgPanel, borderRadius: colors.radiusSm }}>
                    <span style={{ color: colors.textMuted }}>WEIGHT:</span>
                    <span style={{ color: colors.textPrimary }}>~5 TONS</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom panel */}
          <div className="p-3" style={{ 
            background: colors.bgPanel,
            borderTop: `1px solid ${colors.border}`,
          }}>
            <div className="flex justify-center items-center gap-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
              <div className="text-[9px] tracking-[0.15em] font-mono" style={{ color: colors.textMuted }}>
                → {t('nav.game')}
              </div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
