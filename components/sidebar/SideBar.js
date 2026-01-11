"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarHeader from "@/components/sidebar/SidebarHeader";
import UserProfile from "@/components/sidebar/UserProfile";
import NavSection from "@/components/sidebar/NavSection";
import LogoutButton from "@/components/sidebar/LogoutButton";
import MobileNav from "@/components/sidebar/MobileNav";
import { mainNavItems, bottomNavItems } from "@/config/navConfig";

export default function Sidebar({ userData }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const pathname = usePathname();

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside
        className={`hidden md:flex h-screen bg-[#0E121A] bg-linear-to-b from-[#0E121A] to-[#3472EE35] text-white transition-all duration-300 flex-col ${
          isCollapsed ? "w-20" : "w-90"
        }`}
      >
        {/* Header */}
        <SidebarHeader isCollapsed={isCollapsed} onToggle={handleToggle} />

        {/* User Profile - Now using real user data */}
        <UserProfile
          isCollapsed={isCollapsed}
          name={userData.name}
          email={userData.email}
          avatar={userData.avatar}
          initials={userData.initials}
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
      </aside>

      {/* Mobile Bottom Navigation - Visible only on mobile */}
      <MobileNav
        items={mainNavItems}
        currentPath={pathname}
        onItemClick={setActiveItem}
      />
    </>
  );
}
