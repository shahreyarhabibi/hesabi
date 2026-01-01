// app/sign-up/page.jsx
import HeroSection from "@/components/HeroSection";
import { SignUpFormClient } from "@/components/auth/AuthFormClient";

export const metadata = {
  title: "Sign Up | Your App Name",
  description: "Create a new account",
};

export default function SignUpPage() {
  return (
    <main className="grid md:grid-cols-2 min-h-screen">
      <HeroSection />
      <SignUpFormClient />
    </main>
  );
}
