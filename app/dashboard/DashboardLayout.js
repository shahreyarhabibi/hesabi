// app/dashboard/layout.jsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SideBar from "@/components/sidebar/Sidebar";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] min-h-screen">
        <div className="hidden md:block h-screen sticky top-0">
          <SideBar />
        </div>

        <div className="overflow-y-auto h-screen">
          <div className="p-4 md:p-8 md:px-25">{children}</div>
        </div>
      </div>
    </div>
  );
}
