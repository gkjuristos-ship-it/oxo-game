'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { sdk } from '@farcaster/frame-sdk';

// Define our own context type based on SDK structure
interface FrameContextUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface FrameContextData {
  user?: FrameContextUser;
  [key: string]: unknown;
}

interface FarcasterUser {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
}

interface FarcasterContextType {
  isSDKLoaded: boolean;
  isInFrame: boolean;
  context: FrameContextData | null;
  user: FarcasterUser | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  error: string | null;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isSDKLoaded: false,
  isInFrame: false,
  context: null,
  user: null,
  isConnected: false,
  connect: async () => {},
  error: null,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

interface FarcasterProviderProps {
  children: ReactNode;
}

export function FarcasterProvider({ children }: FarcasterProviderProps) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isInFrame, setIsInFrame] = useState(false);
  const [context, setContext] = useState<FrameContextData | null>(null);
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initSDK = async () => {
      try {
        // Check if we're in a Farcaster frame
        const frameContext = await sdk.context;
        
        if (frameContext) {
          setIsInFrame(true);
          setContext(frameContext);
          
          // Extract user info from context
          if (frameContext.user) {
            setUser({
              fid: frameContext.user.fid,
              username: frameContext.user.username,
              displayName: frameContext.user.displayName,
              pfpUrl: frameContext.user.pfpUrl,
            });
            setIsConnected(true);
          }
        }
        
        // Signal that the app is ready
        sdk.actions.ready();
        setIsSDKLoaded(true);
      } catch (err) {
        console.log('Not in Farcaster frame or SDK error:', err);
        setIsSDKLoaded(true);
        // Not in frame - that's okay, app works standalone too
      }
    };

    initSDK();
  }, []);

  const connect = useCallback(async () => {
    if (!isInFrame) {
      setError('Not in Farcaster frame');
      return;
    }

    try {
      // Request sign-in if not already connected
      const result = await sdk.actions.signIn({
        nonce: Math.random().toString(36).substring(7),
      });
      
      if (result) {
        setIsConnected(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to connect');
      console.error('Farcaster connect error:', err);
    }
  }, [isInFrame]);

  return (
    <FarcasterContext.Provider
      value={{
        isSDKLoaded,
        isInFrame,
        context,
        user,
        isConnected,
        connect,
        error,
      }}
    >
      {children}
    </FarcasterContext.Provider>
  );
}
