import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SessionWrapper from "@/components/SessionWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Get me a Coffee - Fuel your passion, one cup at a time",
  description: "A Platform to support your favorite creators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
  <body className="bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px] text-white">
    <SessionWrapper> 
      <Navbar />
      <main className="flex justify-center">
        <div className="min-h-screen w-full px-4">
          {children}
        </div>
      </main>
      <Footer />
    </SessionWrapper>
  </body>
</html>
 );
}