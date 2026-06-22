import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'leaflet/dist/leaflet.css'

import ReduxProvider from '../redux/ReduxProvider';
import  InitUse  from "@/InitUse";
import Provider from "@/lib/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RideX – Smart Vehicle Booking & Rental Platform",
  description: "Experience seamless vehicle booking and rentalwith RideX. Our smart platform offers a wide range of vehices, competitive pricing, and user-friendly features to make your transportation needs hassle-free. Book your ridetoday and enjoy the convenience of RideX!",
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
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          <ReduxProvider>
        <InitUse/>
          {children}
      </ReduxProvider>
        </Provider>
      
      </body>
    </html>
  );
}
