// components/sidebar/MobileNav.jsx
"use client";

import Link from "next/link";

export default function MobileNav({ items, currentPath, onItemClick }) {
  const mobileItems = items.slice(0, 5);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
      {/* Blur background */}
      <div className="absolute inset-0 bg-[#0a0d14]/90 backdrop-blur-xl" />

      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Navigation Items */}
      <div className="relative flex items-center justify-around px-4 py-3 safe-area-bottom">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onItemClick(item.name)}
              className="flex flex-col items-center gap-1.5 min-w-0 flex-1 group"
            >
              {/* Icon Container */}
              <div className="relative">
                {/* Active glow */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary/40 rounded-xl blur-lg" />
                )}

                <div
                  className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30 scale-110"
                      : "text-white/50 group-active:scale-95 group-hover:text-white group-hover:bg-white/10"
                  }`}
                >
                  <Icon className="text-xl" />
                </div>

                {/* Active dot indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                )}
              </div>

              {/* Label - Always visible on mobile for better UX */}
              <span
                className={`text-[10px] font-medium truncate max-w-full transition-colors ${
                  isActive ? "text-white" : "text-white/40"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
