import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./contexts/AppContext";
import { Notifications } from "./components/Notifications";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Rental Admin Dashboard",
  description: "Admin dashboard for managing car rental listings",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          {children}
          <Notifications />
        </AppProvider>
      </body>
    </html>
  );
}
