import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });

const themeInit = `(function(){try{var s=localStorage.getItem("uangforge-theme");var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://uangforge.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UangForge — watch the factory build",
    template: "%s · UangForge",
  },
  description:
    "Pick a scenario or describe a small business app, then watch the factory plan, build, test and ship it — a working app, not a mockup.",
  openGraph: {
    title: "UangForge — watch the factory build",
    description:
      "Type a small business app, watch the factory build it live, use the result. A portfolio build by Rico.",
    url: siteUrl,
    siteName: "UangCounsel",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
