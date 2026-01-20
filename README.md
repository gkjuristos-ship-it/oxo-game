# OXO Game - EDSAC 1952 Farcaster Mini App

A faithful recreation of the world's first graphical computer game (1952) as a Farcaster Mini App with Web3 integration.

## 🎮 About

OXO (Noughts and Crosses) was developed in 1952 by Alexander S. Douglas for the EDSAC computer at Cambridge University. This project brings that historic game to Farcaster as an interactive Mini App.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the game.

### Build & Type Check

```bash
# Build for production
npm run build

# Type checking
npm run typecheck

# Lint code
npm run lint
```

## 📦 Deployment

### Option 1: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import from GitHub: `gkjuristos-ship-it/oxo-game`
4. Click **"Deploy"**
5. Follow [post-deployment setup](#post-deployment-setup)

### Option 2: Vercel CLI

```bash
# Login to Vercel (opens browser)
vercel login

# Deploy to production
npm run deploy
```

The automated script will:
- Verify authentication
- Run local build check
- Deploy to Vercel production
- Show next steps

### Option 3: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gkjuristos-ship-it/oxo-game)

## ⚙️ Post-Deployment Setup

After deploying, configure environment variables:

### 1. Add NEXT_PUBLIC_APP_URL

In [Vercel Dashboard](https://vercel.com/dashboard):
1. Go to your project → **Settings** → **Environment Variables**
2. Add variable:
   - **Name**: `NEXT_PUBLIC_APP_URL`
   - **Value**: `https://your-deployment.vercel.app`
   - **Environments**: Production, Preview, Development

### 2. Sign Farcaster Manifest

1. Go to [Warpcast Developers](https://warpcast.com/~/developers/frames)
2. Click **"New Frame"**
3. Enter manifest URL: `https://your-deployment.vercel.app/.well-known/farcaster.json`
4. Click **"Verify & Sign"**
5. Copy the three values: `FARCASTER_HEADER`, `FARCASTER_PAYLOAD`, `FARCASTER_SIGNATURE`

### 3. Add Farcaster Variables

Add these three variables in Vercel Dashboard:
- `FARCASTER_HEADER`
- `FARCASTER_PAYLOAD`
- `FARCASTER_SIGNATURE`

### 4. Redeploy

Go to **Deployments** → Click **⋯** on latest deployment → **"Redeploy"**

### Automated Setup (CLI)

```bash
npm run setup-env
```

This interactive script will guide you through adding all environment variables.

## ✅ Verify Deployment

After setup, verify:

1. **App loads**: `https://your-deployment.vercel.app/`
2. **Manifest works**: `https://your-deployment.vercel.app/.well-known/farcaster.json`
3. **Test in Farcaster**: Share URL in Warpcast cast

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide
- [QUICKSTART.md](./QUICKSTART.md) - Fast deployment walkthrough
- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables reference
- [MANIFEST_SIGNING.md](./MANIFEST_SIGNING.md) - Farcaster manifest signing

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **UI**: React 18 + Tailwind CSS + Framer Motion
- **Web3**: OnchainKit, Wagmi, Viem
- **Farcaster**: Frame SDK
- **Database**: Supabase
- **Deployment**: Vercel

## 📋 Project Structure

```
oxo-game/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   └── lib/              # Utilities & configs
├── public/               # Static assets
├── scripts/              # Deployment automation
│   ├── deploy.sh         # Automated Vercel deploy
│   └── setup-env.sh      # Interactive env setup
└── docs/                 # Documentation
```

## 🐛 Troubleshooting

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Redeploy after adding variables
- Check they're added to all environments
- Verify exact variable names (case-sensitive)

### Manifest Not Loading
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check Farcaster signature variables are present
- Test manifest endpoint directly

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Farcaster Frames](https://docs.farcaster.xyz/developers/frames)
- [OnchainKit](https://onchainkit.xyz)
- [Vercel Deployment](https://vercel.com/docs)

## 📜 License

MIT
