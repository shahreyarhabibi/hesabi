// components/sidebar/SidebarHeader.jsx
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function SidebarHeader({ isCollapsed, onToggle }) {
  return (
    <div className="p-5 border-b border-white/10 flex items-center justify-between">
      <div
        className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100 gap-3"
        }`}
      >
        {/* Logo */}
        <div className="relative shrink-0">
          <div className="w-11 h-11 bg-linear-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
            <span className="text-xl font-bold text-white">H</span>
          </div>
          <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl -z-10" />
        </div>

        {/* Brand Name */}
        <div className="shrink-0 whitespace-nowrap">
          <h1 className="text-xl font-bold bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
            Hesabi
          </h1>
          <p className="text-[10px] text-white/40 font-medium tracking-wider uppercase">
            Finance Manager
          </p>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group shrink-0 ${
          isCollapsed ? "mx-auto" : ""
        }`}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <div className="transition-transform duration-300">
          {isCollapsed ? (
            <FiChevronRight className="text-lg text-white/70 group-hover:text-white transition-colors" />
          ) : (
            <FiChevronLeft className="text-lg text-white/70 group-hover:text-white transition-colors" />
          )}
        </div>
      </button>
    </div>
  );
}
