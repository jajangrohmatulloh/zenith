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

export const metadata: Metadata = {
  title: "Zenith | Premium Task Manager",
  description: "Elevate your daily flow with peak efficiency and surgical precision.",

};


import { TodoProvider } from "@/presentation/context/todo-context";
import { ThemeProvider } from "@/presentation/context/theme-context";
import { AuthProvider } from "@/presentation/context/auth-context";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <TodoProvider>
              {children}
            </TodoProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>

  );
}


