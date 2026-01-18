// components/sidebar/NavSection.jsx
import NavItem from "./NavItem";

export default function NavSection({
  items,
  currentPath,
  isCollapsed,
  onItemClick,
}) {
  return (
    <div className="space-y-1">
      {items.map((item) => {
        const isActive = currentPath === item.href;

        return (
          <NavItem
            key={item.name}
            item={item}
            isActive={isActive}
            isCollapsed={isCollapsed}
            onClick={() => onItemClick(item.name)}
          />
        );
      })}
    </div>
  );
}
