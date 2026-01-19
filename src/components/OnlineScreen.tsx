'use client';

import { useState, useEffect } from 'react';
import { useFarcaster } from '@/lib/farcaster';
import { usePlayer, useMatchmaking, usePrivateRoom, useLeaderboard } from '@/lib/multiplayer';
import { useTheme, ThemeToggle } from '@/lib/theme';
import { useI18n, LanguageToggle } from '@/lib/i18n';

type OnlineTab = 'quick' | 'private' | 'tournaments' | 'leaderboard';

export default function OnlineScreen() {
  const { colors } = useTheme();
  const { t } = useI18n();
  const { user, isConnected, isInFrame, connect, isSDKLoaded } = useFarcaster();
  const [activeTab, setActiveTab] = useState<OnlineTab>('quick');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const userFid = user?.fid || null;
  const displayName = user?.displayName || user?.username || 'PLAYER';

  // Backend hooks
  const { player, createOrUpdatePlayer } = usePlayer(userFid);
  const { 
    isSearching, 
    match: quickMatch, 
    queueCount, 
    error: matchmakingError,
    joinQueue, 
    leaveQueue 
  } = useMatchmaking(userFid, player?.elo || 1000);
  const { 
    roomCode, 
    match: privateMatch, 
    loading: roomLoading,
    error: roomError,
    createRoom, 
    joinRoom 
  } = usePrivateRoom(userFid);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(10);

  // Sync Farcaster user to database
  useEffect(() => {
    if (isConnected && user && userFid) {
      createOrUpdatePlayer({
        fid: userFid,
        username: user.username,
        displayName: user.displayName,
        pfpUrl: user.pfpUrl,
      });
    }
  }, [isConnected, user, userFid, createOrUpdatePlayer]);

  // Format leaderboard for display (use real data or fallback)
  const displayLeaderboard = leaderboard.length > 0 ? leaderboard.map(p => ({
    rank: p.rank,
    name: (p.display_name || p.username || `FID:${p.fid}`).toUpperCase(),
    elo: p.elo,
    wins: p.wins,
  })) : [
    { rank: 1, name: 'WATSON', elo: 2847, wins: 156 },
    { rank: 2, name: 'TURING', elo: 2691, wins: 142 },
    { rank: 3, name: 'WILKES', elo: 2534, wins: 128 },
    { rank: 4, name: 'LOVELACE', elo: 2488, wins: 119 },
    { rank: 5, name: 'BABBAGE', elo: 2401, wins: 107 },
  ];

  const mockTournaments = [
    { id: 1, name: 'DAILY BLITZ', players: '12/16', status: 'OPEN', prize: '0.01 ETH' },
    { id: 2, name: 'WEEKLY CUP', players: '28/32', status: 'STARTING', prize: '0.1 ETH' },
    { id: 3, name: 'GRAND PRIX', players: '64/64', status: 'LIVE', prize: '1 ETH' },
  ];

  // Player stats from database or defaults
  const playerElo = player?.elo || 1000;
  const playerWins = player?.wins || 0;
  const playerLosses = player?.losses || 0;

  // Handle match found
  const activeMatch = quickMatch || privateMatch;

  const tabs: { id: OnlineTab; label: string }[] = [
    { id: 'quick', label: 'QUICK' },
    { id: 'private', label: 'ROOM' },
    { id: 'tournaments', label: 'TOURNEY' },
    { id: 'leaderboard', label: 'RANKS' },
  ];

  // Auth required content wrapper
  const AuthRequired = ({ children }: { children: React.ReactNode }) => {
    if (!isSDKLoaded) {
      return (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="animate-pulse" style={{ color: colors.primary }}>LOADING...</div>
        </div>
      );
    }

    if (!isConnected) {
      return (
        <div className="flex flex-col items-center justify-center h-48 gap-4">
          <div className="text-sm font-mono text-center" style={{ color: colors.warning }}>
            {isInFrame ? 'CONNECT TO PLAY ONLINE' : 'OPEN IN FARCASTER TO PLAY'}
          </div>
          {isInFrame && (
            <button
              onClick={connect}
              className="px-6 py-2 border rounded text-sm font-mono transition-all"
              style={{ 
                background: `linear-gradient(to bottom, ${colors.primaryDim}, ${colors.bgPanel})`,
                borderColor: `${colors.primary}80`,
                color: colors.primary,
                boxShadow: `0 0 10px ${colors.primaryGlow}`,
              }}
            >
              CONNECT
            </button>
          )}
          <div className="text-[9px] font-mono mt-2" style={{ color: colors.textMuted }}>
            Farcaster authentication required
          </div>
        </div>
      );
    }

    return <>{children}</>;
  };

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
          
          {/* Header */}
          <div className="p-3" style={{ 
            background: colors.bgPanel,
            borderBottom: `1px solid ${colors.border}`,
          }}>
            <div className="flex justify-between items-center">
              <div className="scale-75 origin-left">
                <LanguageToggle />
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'animate-pulse' : ''}`} 
                     style={{ 
                       backgroundColor: isConnected ? colors.success : colors.textMuted,
                     }} />
                <div className="text-[9px] tracking-[0.2em] font-mono" style={{ color: colors.textMuted }}>
                  {t('online.title')}
                </div>
              </div>
              <div className="scale-75 origin-right">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="p-1 flex gap-1" style={{ backgroundColor: colors.bgPanel, borderBottom: `1px solid ${colors.border}` }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2 text-[10px] font-mono tracking-wider transition-all"
                style={{
                  backgroundColor: activeTab === tab.id ? colors.bgScreen : 'transparent',
                  color: activeTab === tab.id ? colors.primary : colors.textMuted,
                  borderRadius: colors.radiusSm,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 min-h-[320px]" style={{ backgroundColor: colors.bgScreen }}>
            
            {/* Quick Match */}
            {activeTab === 'quick' && (
              <AuthRequired>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg tracking-wider mb-1" style={{ color: colors.primary, textShadow: `0 0 10px ${colors.primaryGlow}` }}>
                      QUICK MATCH
                    </div>
                    <div className="text-[10px]" style={{ color: colors.primaryDim }}>Find a random opponent</div>
                  </div>

                  {matchmakingError && (
                    <div className="text-[10px] text-center font-mono" style={{ color: colors.error }}>
                      {matchmakingError}
                    </div>
                  )}

                  {activeMatch ? (
                    <div className="flex flex-col items-center gap-4 mt-6">
                      <div className="text-lg animate-pulse" style={{ color: colors.primary }}>MATCH FOUND!</div>
                      <div className="text-sm" style={{ color: colors.primaryDim }}>vs OPPONENT</div>
                      <div className="text-[10px]" style={{ color: colors.textMuted }}>Match ID: {activeMatch.id?.slice(0,8)}...</div>
                    </div>
                  ) : !isSearching ? (
                    <div className="flex flex-col items-center gap-4 mt-6">
                      <button
                        onClick={joinQueue}
                        className="w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all group"
                        style={{ 
                          background: `linear-gradient(to bottom, ${colors.primaryDim}, ${colors.bgPanel})`,
                          borderColor: `${colors.primary}80`,
                          boxShadow: `0 0 20px ${colors.primaryGlow}`,
                        }}
                      >
                        <span className="text-xl font-mono group-hover:scale-110 transition-transform" style={{ color: colors.primary }}>
                          ▶ PLAY
                        </span>
                      </button>
                      <div className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                        ~{queueCount || 0} players in queue
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 mt-6">
                      <div className="w-32 h-32 rounded-full border-4 flex items-center justify-center relative" style={{ borderColor: `${colors.primary}30` }}>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: colors.primary }} />
                        <span className="text-sm font-mono animate-pulse" style={{ color: colors.primary }}>
                          SEARCHING
                        </span>
                      </div>
                      <button
                        onClick={leaveQueue}
                        className="text-[10px] font-mono hover:underline"
                        style={{ color: colors.error }}
                      >
                        CANCEL
                      </button>
                    </div>
                  )}

                  <div className="mt-4 p-2 border rounded text-center" style={{ backgroundColor: colors.bgPanel, borderColor: colors.primaryDim }}>
                    <div className="text-[9px] font-mono" style={{ color: colors.textMuted }}>{displayName}</div>
                    <div className="flex justify-center gap-4 mt-1">
                      <div>
                        <div className="text-sm" style={{ color: colors.primary }}>{playerElo.toLocaleString()}</div>
                        <div className="text-[8px]" style={{ color: colors.primaryDim }}>ELO</div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: colors.primary }}>{playerWins}</div>
                        <div className="text-[8px]" style={{ color: colors.primaryDim }}>WINS</div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: colors.error }}>{playerLosses}</div>
                        <div className="text-[8px]" style={{ color: colors.error }}>LOSSES</div>
                      </div>
                    </div>
                  </div>
                </div>
              </AuthRequired>
            )}

            {/* Private Room */}
            {activeTab === 'private' && (
              <AuthRequired>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg tracking-wider mb-1" style={{ color: colors.primary, textShadow: `0 0 10px ${colors.primaryGlow}` }}>
                      PRIVATE ROOM
                    </div>
                    <div className="text-[10px]" style={{ color: colors.primaryDim }}>Play with friends</div>
                  </div>

                  {roomError && (
                    <div className="text-[10px] text-center font-mono" style={{ color: colors.error }}>
                      {roomError}
                    </div>
                  )}

                  {privateMatch ? (
                    <div className="flex flex-col items-center gap-4 mt-4">
                      <div className="text-lg" style={{ color: colors.primary }}>
                        {privateMatch.status === 'waiting' ? 'WAITING FOR OPPONENT...' : 'GAME STARTED!'}
                      </div>
                      {roomCode && (
                        <div className="p-3 border rounded" style={{ backgroundColor: colors.bgPanel, borderColor: `${colors.primary}80` }}>
                          <div className="text-[9px] mb-1" style={{ color: colors.textMuted }}>ROOM CODE:</div>
                          <div className="text-2xl font-mono tracking-[0.3em]" style={{ color: colors.primary }}>{roomCode}</div>
                        </div>
                      )}
                      <div className="text-[10px]" style={{ color: colors.textMuted }}>Share this code with your friend</div>
                    </div>
                  ) : (
                    <div className="grid gap-4 mt-4">
                      <div className="p-3 border rounded" style={{ backgroundColor: colors.bgPanel, borderColor: colors.primaryDim }}>
                        <div className="text-xs mb-2" style={{ color: colors.warning }}>▶ CREATE ROOM</div>
                        <button 
                          onClick={createRoom}
                          disabled={roomLoading}
                          className="w-full py-2 border rounded text-sm font-mono transition-all disabled:opacity-50"
                          style={{ 
                            background: `linear-gradient(to bottom, ${colors.primaryDim}, ${colors.bgPanel})`,
                            borderColor: `${colors.primary}30`,
                            color: colors.primary,
                          }}
                        >
                          {roomLoading ? 'CREATING...' : 'GENERATE CODE'}
                        </button>
                      </div>

                      <div className="p-3 border rounded" style={{ backgroundColor: colors.bgPanel, borderColor: colors.primaryDim }}>
                        <div className="text-xs mb-2" style={{ color: colors.warning }}>▶ JOIN ROOM</div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={joinCodeInput}
                            onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                            placeholder="ENTER CODE"
                            maxLength={6}
                            className="flex-1 border rounded px-2 py-1.5 text-sm font-mono focus:outline-none"
                            style={{ 
                              backgroundColor: colors.bgInput,
                              borderColor: colors.border,
                              color: colors.primary,
                            }}
                          />
                          <button 
                            onClick={() => joinRoom(joinCodeInput)}
                            disabled={roomLoading || joinCodeInput.length < 6}
                            className="px-4 py-1.5 border rounded text-sm font-mono transition-all disabled:opacity-50"
                            style={{ 
                              background: `linear-gradient(to bottom, ${colors.primaryDim}, ${colors.bgPanel})`,
                              borderColor: `${colors.primary}30`,
                              color: colors.primary,
                            }}
                          >
                            {roomLoading ? '...' : 'JOIN'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AuthRequired>
            )}

            {/* Tournaments */}
            {activeTab === 'tournaments' && (
              <div className="space-y-3">
                <div className="text-center mb-3">
                  <div className="text-lg tracking-wider" style={{ color: colors.primary, textShadow: `0 0 10px ${colors.primaryGlow}` }}>
                    {t('online.tournaments')}
                  </div>
                </div>

                {mockTournaments.map(t => (
                  <div key={t.id} className="p-2 border rounded" style={{ backgroundColor: colors.bgPanel, borderColor: colors.primaryDim }}>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs font-mono" style={{ color: colors.primary }}>{t.name}</div>
                        <div className="text-[9px]" style={{ color: colors.textMuted }}>{t.players} players • {t.prize}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-2 py-0.5 rounded" style={{
                          backgroundColor: t.status === 'OPEN' ? colors.primaryDim : t.status === 'STARTING' ? `${colors.warning}30` : `${colors.error}30`,
                          color: t.status === 'OPEN' ? colors.primary : t.status === 'STARTING' ? colors.warning : colors.error,
                        }}>
                          {t.status}
                        </span>
                        {t.status === 'OPEN' && isConnected && (
                          <button className="text-[9px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: colors.primary, color: colors.bgMain }}>
                            JOIN
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center mt-4">
                  <button className="text-[10px] font-mono hover:underline" style={{ color: colors.warning }}>
                    VIEW ALL TOURNAMENTS →
                  </button>
                </div>
              </div>
            )}

            {/* Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="space-y-2">
                <div className="text-center mb-3">
                  <div className="text-lg tracking-wider" style={{ color: colors.primary, textShadow: `0 0 10px ${colors.primaryGlow}` }}>
                    {t('online.leaderboard')}
                  </div>
                </div>

                {leaderboardLoading ? (
                  <div className="text-center animate-pulse py-8" style={{ color: colors.primary }}>LOADING...</div>
                ) : (
                  <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 gap-y-1 text-[10px] font-mono">
                    <div style={{ color: colors.textMuted }}>#</div>
                    <div style={{ color: colors.textMuted }}>PLAYER</div>
                    <div style={{ color: colors.textMuted }}>ELO</div>
                    <div style={{ color: colors.textMuted }}>W</div>
                    
                    {displayLeaderboard.map((p, i) => (
                      <div key={p.rank} className="contents">
                        <div style={{ color: i === 0 ? colors.warning : i === 1 ? '#aaa' : i === 2 ? '#aa6633' : colors.textMuted }}>
                          {p.rank}
                        </div>
                        <div style={{ color: colors.primary }}>{p.name}</div>
                        <div style={{ color: colors.primary }}>{p.elo.toLocaleString()}</div>
                        <div style={{ color: colors.primaryDim }}>{p.wins}</div>
                      </div>
                    ))}
                  </div>
                )}

                {isConnected && player && (
                  <div className="mt-4 p-2 border rounded" style={{ backgroundColor: colors.bgPanel, borderColor: colors.warning }}>
                    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 text-[10px] font-mono">
                      <div style={{ color: colors.warning }}>--</div>
                      <div style={{ color: colors.warning }}>{displayName.toUpperCase()}</div>
                      <div style={{ color: colors.warning }}>{playerElo.toLocaleString()}</div>
                      <div style={{ color: colors.warning }}>{playerWins}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3" style={{ 
            background: colors.bgPanel,
            borderTop: `1px solid ${colors.border}`,
          }}>
            <div className="flex justify-center items-center gap-4">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
              <div className="text-[9px] tracking-[0.15em] font-mono" style={{ color: colors.textMuted }}>
                ← {t('nav.game')}
              </div>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.primary }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
