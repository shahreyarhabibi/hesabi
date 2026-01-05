export default function UserProfile({
  isCollapsed,
  name = "John Doe",
  email = "john@example.com",
  initials = "JD",
}) {
  return (
    <div className="p-6 border-b border-gray-700">
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "space-x-3"
        }`}
      >
        <div className="relative">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-lg font-bold">
            {initials}
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        {!isCollapsed && (
          <div className="flex-1 overflow-hidden">
            <h3 className="font-semibold truncate">{name}</h3>
            <p className="text-text text-sm truncate">{email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
