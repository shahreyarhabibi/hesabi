// components/sidebar/Sidebar.jsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarHeader from "@/components/sidebar/SidebarHeader";
import UserProfile from "@/components/sidebar/UserProfile";
import NavSection from "@/components/sidebar/NavSection";
import LogoutButton from "@/components/sidebar/LogoutButton";
import MobileNav from "@/components/sidebar/MobileNav";
import { mainNavItems, bottomNavItems } from "@/config/navConfig";
import { APP_INFO } from "@/components/about/AboutContent";

export default function Sidebar({ userData }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const pathname = usePathname();

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex h-screen text-white flex-col relative transition-[width] duration-300 ease-in-out ${
          isCollapsed ? "w-21.25" : "w-85"
        }`}
      >
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-[#0a0d14]">
          <div className="absolute inset-0 bg-linear-to-b from-primary/10 via-transparent to-primary/5" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        {/* Right border glow */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-linear-to-b from-transparent via-primary/30 to-transparent" />

        {/* Content */}
        <div className="relative flex flex-col h-full overflow-hidden">
          {/* Header */}
          <SidebarHeader isCollapsed={isCollapsed} onToggle={handleToggle} />

          {/* User Profile */}
          <UserProfile
            isCollapsed={isCollapsed}
            name={userData.name}
            lastName={userData.lastName}
            email={userData.email}
            avatar={userData.avatar}
            initials={userData.initials}
          />

          {/* Main Navigation */}
          <nav
            className={`flex-1 p-4 space-y-1.5 ${
              isCollapsed
                ? "overflow-hidden"
                : "overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            }`}
          >
            {/* Section Label */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "max-h-0 opacity-0 mb-0"
                  : "max-h-10 opacity-100 mb-3"
              }`}
            >
              <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                Main Menu
              </p>
            </div>
            <NavSection
              items={mainNavItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onItemClick={setActiveItem}
            />
          </nav>

          {/* Bottom Navigation */}
          <div className="p-4 border-t border-white/10 space-y-1.5">
            {/* Section Label */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed
                  ? "max-h-0 opacity-0 mb-0"
                  : "max-h-10 opacity-100 mb-3"
              }`}
            >
              <p className="px-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                Settings
              </p>
            </div>
            <NavSection
              items={bottomNavItems}
              currentPath={pathname}
              isCollapsed={isCollapsed}
              onItemClick={setActiveItem}
            />

            {/* Logout Button */}
            <LogoutButton isCollapsed={isCollapsed} />
          </div>

          {/* Version Badge */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed
                ? "max-h-0 opacity-0 p-0"
                : "max-h-20 opacity-100 p-4 pt-0"
            }`}
          >
            <div className="px-3 text-center">
              <span className="text-xs text-white/40 whitespace-nowrap">
                Version {APP_INFO.version}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        items={mainNavItems}
        currentPath={pathname}
        onItemClick={setActiveItem}
      />
    </>
  );
}
