import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://app-nu-two-69.vercel.app';

  // Account association generated from Farcaster portal
  const manifest = {
    accountAssociation: {
      header: process.env.FARCASTER_HEADER?.trim() || 'eyJmaWQiOjIzNjUzMTMsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhiMzY1MzM1YWYxNDkwZDcxODA0N2Q1NmEzNjM5ODc3ZUFmZGU0ZjgyIn0',
      payload: process.env.FARCASTER_PAYLOAD?.trim() || 'eyJkb21haW4iOiJhcHAtbnUtdHdvLTY5LnZlcmNlbC5hcHAifQ',
      signature: process.env.FARCASTER_SIGNATURE?.trim() || 'JMYZIWWYEwo2w/NrWiOMQcF+uPa++fvOkb997qK444IqDx8H73MykTXhjD8PxSMqfa0Ipy2hV0Fs0KFwIWVHJhw=',
    },
    miniapp: {
      version: '1',
      name: 'OXO - EDSAC 1952',
      iconUrl: `${appUrl}/icon.png`,
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: '#0a0b0d',
      homeUrl: appUrl,
      imageUrl: `${appUrl}/icon.png`,
      buttonTitle: 'Play Now',
      subtitle: 'First computer game (1952)',
      description: 'Experience OXO, the world\'s first computer game created on EDSAC in 1952. Play the classic tic-tac-toe game reimagined for modern platforms.',
      screenshotUrls: [`${appUrl}/splash.png`],
      primaryCategory: 'games',
      tags: ['game', 'retro', 'tic-tac-toe', 'classic'],
      heroImageUrl: `${appUrl}/splash.png`,
      tagline: 'First computer game ever',
      ogTitle: 'OXO - EDSAC 1952',
      ogDescription: 'Experience the world\'s first computer game from 1952',
      ogImageUrl: `${appUrl}/splash.png`,
      castShareUrl: appUrl,
    },
  };

  return NextResponse.json(manifest);
}

