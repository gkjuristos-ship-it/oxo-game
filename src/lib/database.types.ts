export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          fid: number
          username: string | null
          display_name: string | null
          pfp_url: string | null
          elo: number
          wins: number
          losses: number
          draws: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          fid: number
          username?: string | null
          display_name?: string | null
          pfp_url?: string | null
          elo?: number
          wins?: number
          losses?: number
          draws?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          fid?: number
          username?: string | null
          display_name?: string | null
          pfp_url?: string | null
          elo?: number
          wins?: number
          losses?: number
          draws?: number
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          player1_fid: number
          player2_fid: number | null
          board: string
          current_turn: number
          status: 'waiting' | 'playing' | 'finished'
          winner_fid: number | null
          result: 'win' | 'lose' | 'draw' | null
          room_code: string | null
          is_ranked: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          player1_fid: number
          player2_fid?: number | null
          board?: string
          current_turn?: number
          status?: 'waiting' | 'playing' | 'finished'
          winner_fid?: number | null
          result?: 'win' | 'lose' | 'draw' | null
          room_code?: string | null
          is_ranked?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          player1_fid?: number
          player2_fid?: number | null
          board?: string
          current_turn?: number
          status?: 'waiting' | 'playing' | 'finished'
          winner_fid?: number | null
          result?: 'win' | 'lose' | 'draw' | null
          room_code?: string | null
          is_ranked?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      matchmaking_queue: {
        Row: {
          id: string
          fid: number
          elo: number
          joined_at: string
        }
        Insert: {
          id?: string
          fid: number
          elo?: number
          joined_at?: string
        }
        Update: {
          id?: string
          fid?: number
          elo?: number
          joined_at?: string
        }
      }
      tournaments: {
        Row: {
          id: string
          name: string
          description: string | null
          max_players: number
          current_players: number
          status: 'registration' | 'starting' | 'live' | 'finished'
          bracket: Json | null
          prize_pool: string | null
          start_time: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          max_players?: number
          current_players?: number
          status?: 'registration' | 'starting' | 'live' | 'finished'
          bracket?: Json | null
          prize_pool?: string | null
          start_time: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          max_players?: number
          current_players?: number
          status?: 'registration' | 'starting' | 'live' | 'finished'
          bracket?: Json | null
          prize_pool?: string | null
          start_time?: string
          created_at?: string
        }
      }
      tournament_participants: {
        Row: {
          id: string
          tournament_id: string
          fid: number
          seed: number | null
          eliminated: boolean
          created_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          fid: number
          seed?: number | null
          eliminated?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          tournament_id?: string
          fid?: number
          seed?: number | null
          eliminated?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      leaderboard: {
        Row: {
          fid: number
          username: string | null
          display_name: string | null
          elo: number
          wins: number
          rank: number
        }
      }
    }
    Functions: {
      get_queue_count: {
        Args: Record<string, never>
        Returns: number
      }
    }
  }
}

export type Player = Database['public']['Tables']['players']['Row']
export type Match = Database['public']['Tables']['matches']['Row']
export type Tournament = Database['public']['Tables']['tournaments']['Row']
export type LeaderboardEntry = Database['public']['Views']['leaderboard']['Row']
