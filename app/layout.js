/**
 * Heasbi - Personal Finance Management Application
 * Copyright (C) 2025-2026 Ali Reza Habibi
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * See LICENSE file for full license text.
 */

import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "Hesabi",
  description: "Know Where Your Money Goes",
  icons: {
    icon: "/favicon-dark.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon-dark.ico" type="image/x-icon" />
      </head>
      <body
        suppressHydrationWarning
        className={`${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
