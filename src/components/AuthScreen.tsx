'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useTheme } from '@/lib/theme';
import { useI18n } from '@/lib/i18n';

interface AuthScreenProps {
  onAuthComplete?: () => void;
}

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const { login, authenticated, ready } = usePrivy();
  const { colors } = useTheme();
  const { t } = useI18n();

  // If authenticated, call the callback
  if (authenticated && onAuthComplete) {
    onAuthComplete();
  }

  // Show loading state while Privy is initializing
  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4" style={{ backgroundColor: colors.bgMain }}>
        <div className="text-center">
          <div className="mb-4 text-4xl" style={{ color: colors.primary }}>⚙️</div>
          <p style={{ color: colors.textPrimary }}>{t('loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8" style={{ backgroundColor: colors.bgMain }}>
      {/* App Logo */}
      <div className="mb-8 text-center">
        <div className="mb-4 text-6xl">
          <svg className="w-20 h-20 mx-auto" viewBox="0 0 100 100" fill="none">
            <circle cx="35" cy="35" r="12" stroke={colors.primary} strokeWidth="3" fill="none" />
            <path d="M60 55 L80 75 M80 55 L60 75" stroke={colors.playerO} strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="65" r="8" stroke={colors.textSecondary} strokeWidth="3" fill="none" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: colors.textPrimary }}>
          OXO
        </h1>
        <p className="text-sm opacity-70" style={{ color: colors.textSecondary }}>
          EDSAC • 1952
        </p>
      </div>

      {/* Welcome Message */}
      <div className="max-w-md mb-8 text-center">
        <h2 className="text-xl font-semibold mb-3" style={{ color: colors.textPrimary }}>
          {t('welcomeTitle') || 'Welcome to OXO'}
        </h2>
        <p className="text-sm opacity-80 leading-relaxed" style={{ color: colors.textSecondary }}>
          {t('authDescription') || 'Connect your wallet to play, compete, and earn on Base blockchain. Gasless transactions included.'}
        </p>
      </div>

      {/* Login Button */}
      <button
        onClick={login}
        className="w-full max-w-sm px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
        style={{
          backgroundColor: colors.primary,
          color: colors.bgMain,
        }}
      >
        {t('connectWallet') || 'Connect Wallet'}
      </button>

      {/* Info */}
      <div className="mt-8 max-w-md">
        <div className="flex items-start gap-3 p-4 rounded-xl" style={{ backgroundColor: colors.bgPanel }}>
          <div className="text-2xl">ℹ️</div>
          <div className="flex-1 text-sm opacity-80" style={{ color: colors.textSecondary }}>
            <p className="mb-2">
              {t('authInfo1') || 'Sign in with Farcaster or connect your wallet (MetaMask, Coinbase, Phantom)'}
            </p>
            <p>
              {t('authInfo2') || 'All transactions are gasless within your daily limit on Base'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-xs opacity-50 text-center" style={{ color: colors.textMuted }}>
        <p>{t('poweredBy') || 'Powered by'} Base • Farcaster • Privy</p>
      </div>
    </div>
  );
}
