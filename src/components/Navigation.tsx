import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Code, Globe } from "lucide-react";

interface NavigationProps {
  showHomeButton?: boolean;
}

export const Navigation = ({ showHomeButton = true }: NavigationProps) => {
  const location = useLocation();

  if (!showHomeButton) return null;

  const getCurrentPlayground = () => {
    if (location.pathname === "/python") return "Python IDE";
    if (location.pathname === "/web") return "Web Playground";
    return "IDE";
  };

  const getOtherPlayground = () => {
    if (location.pathname === "/python") {
      return { name: "Web Playground", path: "/web", icon: Globe };
    }
    if (location.pathname === "/web") {
      return { name: "Python IDE", path: "/python", icon: Code };
    }
    return null;
  };

  const otherPlayground = getOtherPlayground();

  return (
    <div className="flex items-center space-x-3">
      {/* Current playground indicator */}
      <span className="text-sm font-medium text-gray-300">
        {getCurrentPlayground()}
      </span>

      {/* Switch playground button */}
      {otherPlayground && (
        <Link
          to={otherPlayground.path}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          title={`Switch to ${otherPlayground.name}`}
        >
          <otherPlayground.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{otherPlayground.name}</span>
        </Link>
      )}

      {/* Home button */}
      <Link
        to="/"
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
        title="Go to Home"
      >
        <ArrowLeft className="w-4 h-4" />
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Home</span>
      </Link>
    </div>
  );
};
