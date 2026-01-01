// components/auth/AuthFormClient.jsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthFormLayout from "./AuthFormLayout";
import PasswordInput from "./PasswordInput";

export function LoginFormClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Added error state
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // In NextAuth v4, you need to import signIn dynamically
      const { signIn } = await import("next-auth/react");

      const result = await signIn("credentials", {
        redirect: false, // Don't redirect automatically, handle it manually
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        // Redirect to dashboard on successful login
        router.push("/dashboard");
        router.refresh(); // Refresh to update session
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Log in to Your Account"
      subtitle="Welcome back! Please log in to continue."
      buttonText={loading ? "Logging in..." : "Login"}
      footerText="Don't have an account? "
      footerLinkText="Sign Up"
      footerLink="/sign-up"
      onSubmit={handleSubmit}
      disabled={loading}
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
          placeholder="Enter your Email"
          className="md:min-w-100 w-85 rounded-sm border border-gray-300 p-2 focus:outline-primary/70"
          required
          disabled={loading}
        />
      </div>

      <PasswordInput
        id="password"
        name="password"
        placeholder="Enter your Password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={loading}
      />

      <label htmlFor="remember" className="flex items-center gap-2 mt-3">
        <input
          id="remember"
          name="remember"
          type="checkbox"
          className="w-4 h-4"
          disabled={loading}
        />
        <span>Remember me</span>
      </label>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </AuthFormLayout>
  );
}

export function SignUpFormClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Redirect to login page on success
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormLayout
      title="Create Your Account"
      subtitle="Join us and start tracking your money."
      buttonText={loading ? "Creating account..." : "Sign Up"}
      footerText="Already have an account? "
      footerLinkText="Sign In"
      footerLink="/login"
      onSubmit={handleSubmit}
      disabled={loading}
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-semibold">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your Full Name"
          className="md:w-100 w-85 rounded-sm border border-gray-300 p-2 focus:outline-primary/70"
          required
          disabled={loading}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your Email"
          className="md:w-100 w-85 rounded-sm border border-gray-300 p-2 focus:outline-primary/70"
          required
          disabled={loading}
        />
      </div>
      <PasswordInput
        id="password"
        name="password"
        placeholder="Enter your Password"
        label="Password"
        value={formData.password}
        onChange={handleChange}
        required
        disabled={loading}
      />

      <PasswordInput
        id="confirmPassword"
        name="confirmPassword"
        placeholder="Re-enter your Password"
        label="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        disabled={loading}
      />
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
    </AuthFormLayout>
  );
}
