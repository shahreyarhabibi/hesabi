"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiBillLine } from "react-icons/ri";
import {
  FiHome,
  FiCreditCard,
  FiPieChart,
  FiTarget,
  FiSettings,
  FiDollarSign,
  FiMenu,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const pathname = usePathname();

  // Navigation items
  const navItems = [
    { name: "dashboard", label: "Dashboard", icon: FiHome, href: "/dashboard" },
    {
      name: "transactions",
      label: "Transactions",
      icon: FiCreditCard,
      href: "/transactions",
    },
    {
      name: "budgets",
      label: "Budgets",
      icon: FiPieChart,
      href: "/budgets",
    },
    { name: "pots", label: "Pots", icon: FiTarget, href: "/pots" },
    {
      name: "recurringbills",
      label: "Recurring Bills",
      icon: RiBillLine,
      href: "/recurring-bills",
    },
  ];

  // Bottom navigation items
  const bottomItems = [
    {
      name: "settings",
      label: "Settings",
      icon: FiSettings,
      href: "/settings",
    },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <aside
      className={`h-screen bg-background bg-linear-to-b from-background to-primary/20 text-white transition-all duration-300 flex flex-col ${
        isCollapsed ? "w-20" : "w-120"
      }`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center w-full" : "space-x-3"
          }`}
        >
          {!isCollapsed && (
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FiDollarSign className="text-xl" />
            </div>
          )}

          {!isCollapsed && <h1 className="text-xl font-bold">FinancePro</h1>}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 bg-primary rounded-lg hover:bg-primary/80 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <FiChevronRight className="text-xl" />
          ) : (
            <FiChevronLeft className="text-xl" />
          )}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-gray-700">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-lg font-bold">
              JD
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <h3 className="font-semibold truncate">John Doe</h3>
              <p className="text-text text-sm truncate">john@example.com</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center rounded-lg p-3 transition-all duration-200 group ${
                isActive
                  ? "bg-accent text-white shadow-lg"
                  : "hover:bg-gray-700 text-text hover:text-foreground"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`text-xl ${
                  isActive ? "text-foreground" : "group-hover:text-foreground"
                }`}
              />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setActiveItem(item.name)}
              className={`flex items-center rounded-lg p-3 transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-foreground shadow-lg"
                  : "hover:bg-gray-700 text-text hover:text-foreground"
              } ${isCollapsed ? "justify-center" : ""}`}
            >
              <Icon
                className={`text-xl ${
                  isActive ? "text-foreground" : "group-hover:text-foreground"
                }`}
              />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-background text-foreground text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center w-full rounded-lg p-3 transition-all duration-200 hover:bg-red-900/30 text-red-400 hover:text-red-300 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <FiLogOut className="text-xl" />
          {!isCollapsed && <span className="ml-3 font-medium">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-background text-foreground text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Logout
            </div>
          )}
        </button>
      </div>

      {/* Mobile Toggle Button (hidden on desktop) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="md:hidden absolute top-4 right-4 p-2 bg-background rounded-lg"
        aria-label="Toggle sidebar"
      >
        <FiMenu className="text-xl" />
      </button>
    </aside>
  );
}
