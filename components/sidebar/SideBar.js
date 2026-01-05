"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarHeader from "@/components/sidebar/SidebarHeader";
import UserProfile from "@/components/sidebar/UserProfile";
import NavSection from "@/components/sidebar/NavSection";
import LogoutButton from "@/components/sidebar/LogoutButton";
import MobileToggle from "@/components/sidebar/MobileToggle";
import { mainNavItems, bottomNavItems } from "@/config/navConfig";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const pathname = usePathname();

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <aside
      className={`h-screen bg-[#0E121A] bg-linear-to-b from-[#0E121A] to-[#3472EE35] text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-100"
      }`}
    >
      {/* Header */}
      <SidebarHeader isCollapsed={isCollapsed} onToggle={handleToggle} />

      {/* User Profile */}
      <UserProfile
        isCollapsed={isCollapsed}
        name="John Doe"
        email="john@example.com"
        initials="JD"
      />

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavSection
          items={mainNavItems}
          currentPath={pathname}
          isCollapsed={isCollapsed}
          onItemClick={setActiveItem}
        />
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <NavSection
          items={bottomNavItems}
          currentPath={pathname}
          isCollapsed={isCollapsed}
          onItemClick={setActiveItem}
        />

        {/* Logout Button */}
        <LogoutButton isCollapsed={isCollapsed} />
      </div>

      {/* Mobile Toggle Button */}
      <MobileToggle onToggle={handleToggle} />
    </aside>
  );
}
