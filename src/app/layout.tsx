import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Marquee from "@/components/Marquee";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast"; // 1. Toaster import korun

export const metadata: Metadata = {
  title: "Bazar Dor - BazarDor",
  description: "Proyojoniyo ponnyer dam ek nojore",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      {/* Browser extension-er karone howa hydration error erate suppressHydrationWarning jukto kora hoyeche */}
      <body className="flex flex-col min-h-screen bg-base-100 text-base-content" suppressHydrationWarning>
        
        {/* 2. Global Toaster component jekono notification show korar jonno */}
        <Toaster position="top-center" reverseOrder={false} />

        {/* Global Navbar */}
        <Navbar />

        {/* Marquee text bar */}
        <Marquee />

        {/* Main content */}
        <main className="flex-grow">{children}</main>

        {/* Global Footer */}
        <Footer />
        
      </body>
    </html>
  );
}


