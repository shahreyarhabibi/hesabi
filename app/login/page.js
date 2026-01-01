// app/login/page.jsx
import HeroSection from "@/components/HeroSection";
import { LoginFormClient } from "@/components/auth/AuthFormClient";

export const metadata = {
  title: "Login | Your App Name",
  description: "Log in to your account",
};

export default function LoginPage() {
  return (
    <main className="grid md:grid-cols-2 min-h-screen">
      <HeroSection />
      <LoginFormClient />
    </main>
  );
}
