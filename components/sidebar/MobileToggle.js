import { FiMenu } from "react-icons/fi";

export default function MobileToggle({ onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="md:hidden absolute top-4 right-4 p-2 bg-background rounded-lg"
      aria-label="Toggle sidebar"
    >
      <FiMenu className="text-xl" />
    </button>
  );
}
