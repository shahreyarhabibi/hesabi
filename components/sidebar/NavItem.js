import Link from "next/link";

export default function NavItem({ item, isActive, isCollapsed, onClick }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center rounded-lg p-3 transition-all duration-200 group ${
        isActive
          ? "bg-accent text-white shadow-lg"
          : "hover:bg-gray-700 text-white/70 dark:text-text hover:text-background dark:hover:text-foreground"
      } ${isCollapsed ? "justify-center" : ""}`}
    >
      <Icon
        className={`text-xl ${
          isActive
            ? "text-background dark:text-foreground"
            : "group-hover:text-background dark:group-hover:text-foreground"
        }`}
      />
      {!isCollapsed && <span className="ml-3 font-medium">{item.label}</span>}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-background text-foreground text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {item.label}
        </div>
      )}
    </Link>
  );
}
