import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://curb.wofobe.com"),
  title: "Curb — Block the scroll. Build the habit.",
  description:
    "Curb is the coach in your pocket that makes discipline easier than distraction. Join the waitlist for early access.",
  openGraph: {
    title: "Curb — Block the scroll. Build the habit.",
    description:
      "Curb is the coach in your pocket that makes discipline easier than distraction. Join the waitlist for early access.",
    url: "https://curb.wofobe.com",
    siteName: "Curb",
    type: "website",
    // Add an /public/og-image.png (1200x630) and uncomment once you have one:
    // images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Curb — Block the scroll. Build the habit.",
    description:
      "Curb is the coach in your pocket that makes discipline easier than distraction. Join the waitlist for early access.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body className="font-body bg-bg-base text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
