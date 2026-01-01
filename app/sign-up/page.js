"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroSection from "@/components/HeroSection";
import AuthForm from "@/components/AuthForm";
import PasswordInput from "@/components/PasswordInput";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid md:grid-cols-2 min-h-screen">
      {/* Left Side */}
      <HeroSection />

      {/* Right Side */}

      <AuthForm
        title={"Create Your Account"}
        subtitle={"Join us and start tracking your money."}
        buttonText={"Sign Up"}
        footerText={"Already have an account?  "}
        footerLinkText={"Sign In"}
        footerLink={"/login"}
        loading={loading}
        handleSubmit={handleSubmit}
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
            placeholder="  Enter your Full Name"
            className="md:w-100 w-85 rounded-sm border border-gray-300 p-2 focus:outline-primary/70"
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
            placeholder="  Enter your Email"
            className="md:w-100 w-85 rounded-sm border border-gray-300 p-2 focus:outline-primary/70"
          />
        </div>
        <PasswordInput
          id="password"
          placeholder=" Enter your Password"
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <PasswordInput
          id="confirmPassword"
          placeholder=" Re-Enter your Password"
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </AuthForm>
    </main>
  );
}
