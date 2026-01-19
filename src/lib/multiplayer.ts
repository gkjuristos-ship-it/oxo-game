'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabase';
import type { Match, Player, LeaderboardEntry } from './database.types';

// Hook for player data
export function usePlayer(fid: number | null) {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fid || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const fetchPlayer = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('players')
          .select('*')
          .eq('fid', fid)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        setPlayer(data as Player | null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch player');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [fid]);

  const createOrUpdatePlayer = useCallback(async (playerData: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  }) => {
    if (!isSupabaseConfigured()) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: upsertError } = await (supabase as any)
      .from('players')
      .upsert({
        fid: playerData.fid,
        username: playerData.username || null,
        display_name: playerData.displayName || null,
        pfp_url: playerData.pfpUrl || null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'fid' })
      .select()
      .single();

    if (upsertError) {
      setError(upsertError.message);
      return null;
    }

    setPlayer(data as Player);
    return data as Player;
  }, []);

  return { player, loading, error, createOrUpdatePlayer };
}

// Hook for matchmaking
export function useMatchmaking(fid: number | null, elo: number = 1000) {
  const [isSearching, setIsSearching] = useState(false);
  const [match, setMatch] = useState<Match | null>(null);
  const [queueCount, setQueueCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Get queue count
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const fetchQueueCount = async () => {
      const { count } = await supabase
        .from('matchmaking_queue')
        .select('*', { count: 'exact', head: true });
      setQueueCount(count || 0);
    };

    fetchQueueCount();
    const interval = setInterval(fetchQueueCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const joinQueue = useCallback(async () => {
    if (!fid || !isSupabaseConfigured()) {
      setError('Not authenticated or Supabase not configured');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Add to queue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: queueError } = await (supabase as any)
        .from('matchmaking_queue')
        .insert({ fid, elo });

      if (queueError) throw queueError;

      // Look for opponent
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: opponents } = await (supabase as any)
        .from('matchmaking_queue')
        .select('*')
        .neq('fid', fid)
        .order('joined_at', { ascending: true })
        .limit(1);

      if (opponents && opponents.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const opponent = opponents[0] as any;
        
        // Create match
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: newMatch, error: matchError } = await (supabase as any)
          .from('matches')
          .insert({
            player1_fid: opponent.fid,
            player2_fid: fid,
            status: 'playing',
            current_turn: opponent.fid,
            is_ranked: true,
          })
          .select()
          .single();

        if (matchError) throw matchError;

        // Remove both from queue
        await supabase.from('matchmaking_queue').delete().eq('fid', fid);
        await supabase.from('matchmaking_queue').delete().eq('fid', opponent.fid);

        setMatch(newMatch as Match);
        setIsSearching(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join queue');
      setIsSearching(false);
    }
  }, [fid, elo]);

  const leaveQueue = useCallback(async () => {
    if (!fid || !isSupabaseConfigured()) return;

    await supabase.from('matchmaking_queue').delete().eq('fid', fid);
    setIsSearching(false);
  }, [fid]);

  // Subscribe to match updates while searching
  useEffect(() => {
    if (!fid || !isSearching || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`matchmaking:${fid}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `player2_fid=eq.${fid}`,
        },
        (payload) => {
          setMatch(payload.new as Match);
          setIsSearching(false);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fid, isSearching]);

  return { isSearching, match, queueCount, error, joinQueue, leaveQueue };
}

// Hook for live match
export function useMatch(matchId: string | null, fid: number | null) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch match
  useEffect(() => {
    if (!matchId || !isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const fetchMatch = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: fetchError } = await (supabase as any)
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setMatch(data as Match);
      }
      setLoading(false);
    };

    fetchMatch();
  }, [matchId]);

  // Subscribe to match updates
  useEffect(() => {
    if (!matchId || !isSupabaseConfigured()) return;

    const newChannel = supabase
      .channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          setMatch(payload.new as Match);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(newChannel);
    };
  }, [matchId]);

  const makeMove = useCallback(async (position: number) => {
    if (!match || !fid || !isSupabaseConfigured()) return false;
    if (match.current_turn !== fid) return false;
    if (match.status !== 'playing') return false;

    const board = JSON.parse(match.board || '[null,null,null,null,null,null,null,null,null]');
    if (board[position] !== null) return false;

    // Determine player symbol
    const isPlayer1 = match.player1_fid === fid;
    board[position] = isPlayer1 ? 'X' : 'O';

    // Check for winner
    const winner = checkWinner(board);
    const isDraw = !winner && board.every((cell: string | null) => cell !== null);
    
    const nextTurn = isPlayer1 ? match.player2_fid : match.player1_fid;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
      board: JSON.stringify(board),
      current_turn: nextTurn,
      updated_at: new Date().toISOString(),
    };

    if (winner) {
      updateData.status = 'finished';
      updateData.winner_fid = fid;
      updateData.result = 'win';
    } else if (isDraw) {
      updateData.status = 'finished';
      updateData.result = 'draw';
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('matches')
      .update(updateData)
      .eq('id', match.id);

    if (updateError) {
      setError(updateError.message);
      return false;
    }

    return true;
  }, [match, fid]);

  return { match, loading, error, makeMove };
}

// Hook for private rooms
export function usePrivateRoom(fid: number | null) {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = useCallback(async () => {
    if (!fid || !isSupabaseConfigured()) {
      setError('Not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    const code = generateRoomCode();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: createError } = await (supabase as any)
      .from('matches')
      .insert({
        player1_fid: fid,
        room_code: code,
        status: 'waiting',
        is_ranked: false,
      })
      .select()
      .single();

    setLoading(false);

    if (createError) {
      setError(createError.message);
      return null;
    }

    setRoomCode(code);
    setMatch(data as Match);
    return code;
  }, [fid]);

  const joinRoom = useCallback(async (code: string) => {
    if (!fid || !isSupabaseConfigured()) {
      setError('Not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    // Find the room
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: room, error: findError } = await (supabase as any)
      .from('matches')
      .select('*')
      .eq('room_code', code.toUpperCase())
      .eq('status', 'waiting')
      .single();

    if (findError || !room) {
      setError('Room not found or already started');
      setLoading(false);
      return false;
    }

    if (room.player1_fid === fid) {
      setError('Cannot join your own room');
      setLoading(false);
      return false;
    }

    // Join the room
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: joinError } = await (supabase as any)
      .from('matches')
      .update({
        player2_fid: fid,
        status: 'playing',
        current_turn: room.player1_fid,
      })
      .eq('id', room.id)
      .select()
      .single();

    setLoading(false);

    if (joinError) {
      setError(joinError.message);
      return false;
    }

    setMatch(data as Match);
    return true;
  }, [fid]);

  // Subscribe to room updates
  useEffect(() => {
    if (!match || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`room:${match.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${match.id}`,
        },
        (payload) => {
          setMatch(payload.new as Match);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match?.id]);

  return { roomCode, match, loading, error, createRoom, joinRoom };
}

// Hook for leaderboard
export function useLeaderboard(limit: number = 10) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const fetchLeaderboard = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error: fetchError } = await (supabase as any)
        .from('players')
        .select('fid, username, display_name, elo, wins')
        .order('elo', { ascending: false })
        .limit(limit);

      if (fetchError) {
        setError(fetchError.message);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const entries = (data || []).map((p: any, i: number) => ({
          fid: p.fid,
          username: p.username,
          display_name: p.display_name,
          elo: p.elo,
          wins: p.wins,
          rank: i + 1,
        })) as LeaderboardEntry[];
        setLeaderboard(entries);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [limit]);

  return { leaderboard, loading, error };
}

// Helper functions
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function checkWinner(board: (string | null)[]): string | null {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}
