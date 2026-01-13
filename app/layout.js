import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "My Personal Wallet",
  description: "Manage your personal income, expenses, and budgets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${poppins.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
