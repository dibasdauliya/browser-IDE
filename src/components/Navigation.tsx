import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ArrowLeft,
  Code,
  Globe,
  Server,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface NavigationProps {
  showHomeButton?: boolean;
}

export const Navigation = ({ showHomeButton = true }: NavigationProps) => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!showHomeButton) return null;

  const getCurrentPlayground = () => {
    if (location.pathname === "/python") return "Python IDE (Browser)";
    if (location.pathname === "/python-backend") return "Python IDE (Backend)";
    if (location.pathname === "/web") return "Web Playground";
    return "IDE";
  };

  const getPlaygrounds = () => {
    const playgrounds = [
      { name: "Browser Python", path: "/python", icon: Code },
      { name: "Backend Python", path: "/python-backend", icon: Server },
      { name: "Web Playground", path: "/web", icon: Globe },
    ];

    return playgrounds;
  };

  const playgrounds = getPlaygrounds();
  const currentPlayground = getCurrentPlayground();

  return (
    <div className="flex items-center space-x-3">
      <Link
        to="/"
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        title="Go to Home"
      >
        <ArrowLeft className="w-4 h-4" />
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>

      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex cursor-pointer items-center space-x-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        >
          <span>{currentPlayground}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
            {playgrounds.map((playground) => (
              <Link
                key={playground.path}
                to={playground.path}
                onClick={() => setIsDropdownOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === playground.path
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <playground.icon className="w-4 h-4" />
                <span>{playground.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    </div>
  );
};
