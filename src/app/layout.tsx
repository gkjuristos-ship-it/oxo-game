import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

// Dynamically import providers to avoid SSR issues
const Providers = dynamic(
  () => import("@/lib/providers").then(mod => ({ default: mod.Providers })),
  { ssr: false }
);

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oxo-game.vercel.app";

export const metadata: Metadata = {
  title: "OXO | EDSAC 1952 Replica",
  description: "Play Tic-Tac-Toe against unbeatable AI. Replica of the first computer game OXO (1952). Draw = Victory!",
  keywords: ["oxo", "edsac", "tic-tac-toe", "1952", "retro", "ai", "minimax", "base", "farcaster", "mini-app"],
  openGraph: {
    title: "OXO | EDSAC 1952 Replica",
    description: "Challenge the machine like in 1952",
    type: "website",
    images: [`${appUrl}/preview.svg`],
  },
  other: {
    "fc:frame": "vNext",
    "fc:frame:image": `${appUrl}/preview.svg`,
    "fc:frame:button:1": "Play OXO",
    "fc:frame:button:1:action": "launch_frame",
    "fc:frame:button:1:target": appUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
