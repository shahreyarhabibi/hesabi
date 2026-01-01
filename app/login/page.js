"use client";

import HeroSection from "@/components/HeroSection";
import AuthForm from "@/components/AuthForm";
import PasswordInput from "@/components/PasswordInput";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <main className="grid md:grid-cols-2 min-h-screen">
      <HeroSection />
      <AuthForm
        title={"Log in to Your Account"}
        subtitle={"Welcome back! Please log in to continue."}
        buttonText={"Login"}
        footerText={"Don't have an account?  "}
        footerLinkText={"Sign Up"}
        footerLink={"/sign-up"}
        handleSubmit={handleLogin}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" Enter your Email"
            className="md:min-w-100 w-85 rounded-sm border border-gray-300 p-2 focus:outline-primary/70"
          />
        </div>

        <PasswordInput
          id="password"
          placeholder=" Enter your Password"
          label="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="remember" className="flex items-center gap-2 mt-3">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            className="w-4 h-4"
          />
          <span>Remember me</span>
        </label>
      </AuthForm>
    </main>
  );
}
