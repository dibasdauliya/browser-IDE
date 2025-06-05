import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

interface NavigationProps {
  showHomeButton?: boolean;
}

export const Navigation = ({ showHomeButton = true }: NavigationProps) => {
  if (!showHomeButton) return null;

  return (
    <Link
      to="/"
      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-4 h-4" />
      <Home className="w-4 h-4" />
      <span>Home</span>
    </Link>
  );
};
