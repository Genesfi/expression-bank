import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// BAGIAN 1: Metadata (untuk memberi tahu browser/ekstensi ini web dark mode)
export const metadata: Metadata = {
  title: "Motion Expression Bank",
  description: "Kumpulan snippet andalan Gusti",
  alternates: {
    canonical: "/",
  },
  // Menambahkan theme color agar ekstensi tahu web ini sudah gelap
  other: {
    "color-scheme": "dark",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      // BAGIAN 2: Menambahkan style color-scheme langsung di tag html
      style={{ colorScheme: 'dark' }}
    >
      <head>
        {/* BAGIAN 3: Meta tag manual di dalam head */}
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a] text-gray-200">
        {children}
      </body>
    </html>
  );
}