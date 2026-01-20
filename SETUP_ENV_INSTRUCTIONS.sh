#!/bin/bash

# OXO Game - Quick Environment Variables Setup Guide
# This file contains step-by-step instructions for configuring Vercel environment variables

echo "======================================"
echo "🔧 OXO Game - Environment Setup"
echo "======================================"
echo ""
echo "Project: oxo-game"
echo "Dashboard: https://vercel.com/dashboard"
echo ""

cat << 'EOF'

STEP 1: Get Your Deployment URL
================================

1. Go to: https://vercel.com/dashboard
2. Click on project: "oxo-game"
3. You'll see your production URL, it will be something like:
   
   https://oxo-game.vercel.app
   
   OR with a custom domain if you set one up.

4. Copy this URL - you'll need it for the next steps!


STEP 2: Add NEXT_PUBLIC_APP_URL
================================

1. In the oxo-game project, go to: Settings → Environment Variables
2. Click "Add New" or "Add Variable"
3. Fill in:
   
   Name:  NEXT_PUBLIC_APP_URL
   Value: https://oxo-game.vercel.app  (or your actual URL)
   
4. Select environments: ✅ Production  ✅ Preview  ✅ Development
5. Click "Save"


STEP 3: Sign Farcaster Manifest
================================

1. Go to: https://warpcast.com/~/developers/frames
2. Click "New Frame" or "Add Frame"
3. Enter your manifest URL:
   
   https://oxo-game.vercel.app/.well-known/farcaster.json
   
4. Click "Verify & Sign"
5. You will receive THREE values - copy them:
   
   ✅ FARCASTER_HEADER     = (copy the header value)
   ✅ FARCASTER_PAYLOAD    = (copy the payload value)
   ✅ FARCASTER_SIGNATURE  = (copy the signature value)


STEP 4: Add Farcaster Variables to Vercel
==========================================

Back in Vercel project settings (Settings → Environment Variables):

Variable 1:
-----------
Name:         FARCASTER_HEADER
Value:        (paste the header value from Step 3)
Environments: ✅ Production  ✅ Preview  ✅ Development
Click "Save"

Variable 2:
-----------
Name:         FARCASTER_PAYLOAD
Value:        (paste the payload value from Step 3)
Environments: ✅ Production  ✅ Preview  ✅ Development
Click "Save"

Variable 3:
-----------
Name:         FARCASTER_SIGNATURE
Value:        (paste the signature value from Step 3)
Environments: ✅ Production  ✅ Preview  ✅ Development
Click "Save"


STEP 5: Redeploy the Project
=============================

After adding ALL FOUR variables:

1. Go to: Deployments tab
2. Find the latest deployment
3. Click the three dots (⋯) menu
4. Click "Redeploy"
5. Confirm the redeploy
6. Wait 1-2 minutes for completion


STEP 6: Verify Everything Works
================================

After redeploy completes:

1. Test the app:
   https://oxo-game.vercel.app/
   → Game should load

2. Test the manifest:
   https://oxo-game.vercel.app/.well-known/farcaster.json
   → Should return JSON with accountAssociation data

3. Test in Farcaster:
   → Share the URL in a Warpcast cast
   → Frame preview should appear
   → Click to open Mini App


SUMMARY - 4 Environment Variables Needed:
==========================================

✅ NEXT_PUBLIC_APP_URL    = https://oxo-game.vercel.app
✅ FARCASTER_HEADER       = (from warpcast.com signing)
✅ FARCASTER_PAYLOAD      = (from warpcast.com signing)
✅ FARCASTER_SIGNATURE    = (from warpcast.com signing)


ESTIMATED TIME: 5-10 minutes total


TROUBLESHOOTING:
================

Problem: Manifest not loading
Solution: Check NEXT_PUBLIC_APP_URL is set correctly, redeploy

Problem: Farcaster frame not showing
Solution: Verify all 3 Farcaster variables are set, redeploy

Problem: Build fails after adding variables
Solution: Check for typos in variable names (case-sensitive!)


Need help? Check:
- DEPLOYMENT.md
- QUICKSTART.md
- ENV_SETUP.md

EOF

echo ""
echo "======================================"
echo "✅ Instructions ready!"
echo "======================================"
echo ""
echo "Follow the steps above to complete setup."
echo ""
