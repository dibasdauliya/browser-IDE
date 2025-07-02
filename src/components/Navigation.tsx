import { Link, useLocation } from "react-router-dom";
import { Home, ArrowLeft, Code, Globe, Server } from "lucide-react";

interface NavigationProps {
  showHomeButton?: boolean;
}

export const Navigation = ({ showHomeButton = true }: NavigationProps) => {
  const location = useLocation();

  if (!showHomeButton) return null;

  const getCurrentPlayground = () => {
    if (location.pathname === "/python") return "Python IDE (Browser)";
    if (location.pathname === "/python-backend") return "Python IDE (Backend)";
    if (location.pathname === "/web") return "Web Playground";
    return "IDE";
  };

  const getOtherPlaygrounds = () => {
    const playgrounds = [];

    if (location.pathname !== "/python") {
      playgrounds.push({ name: "Browser Python", path: "/python", icon: Code });
    }
    if (location.pathname !== "/python-backend") {
      playgrounds.push({
        name: "Backend Python",
        path: "/python-backend",
        icon: Server,
      });
    }
    if (location.pathname !== "/web") {
      playgrounds.push({ name: "Web Playground", path: "/web", icon: Globe });
    }

    return playgrounds;
  };

  const otherPlaygrounds = getOtherPlaygrounds();

  return (
    <div className="flex items-center space-x-3">
      {/* Current playground indicator */}
      <span className="text-sm font-medium text-gray-300">
        {getCurrentPlayground()}
      </span>

      {/* Switch playground buttons */}
      {otherPlaygrounds.map((playground) => (
        <Link
          key={playground.path}
          to={playground.path}
          className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
          title={`Switch to ${playground.name}`}
        >
          <playground.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{playground.name}</span>
        </Link>
      ))}

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
