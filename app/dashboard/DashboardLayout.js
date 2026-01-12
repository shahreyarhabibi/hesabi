// app/dashboard/layout.jsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SidebarWrapper from "@/components/sidebar/SidebarWrapper";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - shows as sidebar on desktop, bottom nav on mobile */}
      <SidebarWrapper />

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-1 mt-5 md:mt-0 overflow-y-auto bg-background pb-20 md:pb-0"
      >
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
