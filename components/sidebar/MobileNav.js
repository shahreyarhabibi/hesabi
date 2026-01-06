"use client";

import Link from "next/link";

export default function MobileNav({ items, currentPath, onItemClick }) {
  // Take only first 5 items for mobile nav
  const mobileItems = items.slice(0, 5);

  return (
    <nav className="md:hidden rounded-tr-4xl rounded-tl-4xl fixed bottom-0 left-0 right-0 bg-[#0E121A] border-t border-gray-700 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-3">
        {mobileItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onItemClick(item.name)}
              className="flex flex-col items-center gap-1 min-w-0 flex-1"
            >
              <div
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/70 hover:text-white active:text-white"
                }`}
              >
                <Icon className="text-xl" />
              </div>
              <span
                className={`hidden text-xs truncate max-w-full px-1 ${
                  isActive ? "text-white font-medium" : "text-white/60"
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
