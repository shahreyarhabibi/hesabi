import { FiLogOut } from "react-icons/fi";
import { signOut } from "next-auth/react";

export default function LogoutButton({ isCollapsed }) {
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center w-full rounded-lg p-3 transition-all duration-200 hover:bg-red-900/30 text-red-400 hover:text-red-300 group ${
        isCollapsed ? "justify-center" : ""
      }`}
    >
      <FiLogOut className="text-xl" />
      {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-background text-foreground text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Logout
        </div>
      )}
    </button>
  );
}
