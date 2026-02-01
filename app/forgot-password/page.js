import ForgotPasswordClient from "@/components/auth/ForgotPasswordClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Forgot Password - Hesabi",
  description: "Reset your Hesabi account password",
};

export default async function ForgotPasswordPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return <ForgotPasswordClient />;
}
