'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { PrivyProvider } from '@privy-io/react-auth';
import { base } from 'wagmi/chains';
import { ThemeProvider } from './theme';
import { I18nProvider } from './i18n';
import { FarcasterProvider } from './farcaster';

const queryClient = new QueryClient();

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
        config={{
          loginMethods: ['farcaster', 'wallet', 'email'],
          appearance: {
            theme: 'dark',
            accentColor: '#22c55e',
            logo: '/icon.svg',
          },
          defaultChain: base,
          supportedChains: [base],
        }}
      >
        <OnchainKitProvider 
          chain={base}
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        >
          <ThemeProvider>
            <I18nProvider>
              <FarcasterProvider>
                {children}
              </FarcasterProvider>
            </I18nProvider>
          </ThemeProvider>
        </OnchainKitProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}
