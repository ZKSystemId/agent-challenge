import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZigsAI Agent Studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Suppress React DevTools warnings in production
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0]?.includes?.('React DevTools') || 
        args[0]?.includes?.('WebSocket') ||
        args[0]?.includes?.('Failed to load resource')
      ) {
        return;
      }
      originalError.apply(console, args);
    };
  }
  
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CopilotKit runtimeUrl="/api/copilotkit">
          {children}
        </CopilotKit>
      </body>
    </html>
  )
}
