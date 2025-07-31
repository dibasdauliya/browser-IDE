import { useState, useEffect } from "react";

interface BackendStatusBarProps {
  onStatusChange?: (status: "unknown" | "connected" | "disconnected") => void;
  onConnect?: () => void;
}

export const BackendStatusBar = ({
  onStatusChange,
  onConnect,
}: BackendStatusBarProps) => {
  const [backendStatus, setBackendStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/health");
      if (response.ok) {
        setBackendStatus("connected");
        onStatusChange?.("connected");
        onConnect?.();
        return true;
      }
    } catch (error) {
      setBackendStatus("disconnected");
      onStatusChange?.("disconnected");
      return false;
    }
    return false;
  };

  const getStatusColor = () => {
    switch (backendStatus) {
      case "connected":
        return "text-green-400";
      case "disconnected":
        return "text-red-400";
      default:
        return "text-yellow-400";
    }
  };

  const getStatusText = () => {
    switch (backendStatus) {
      case "connected":
        return "Backend Connected";
      case "disconnected":
        return "Backend Disconnected";
      default:
        return "Checking Backend...";
    }
  };

  return (
    <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${getStatusColor()}`}>
          <div
            className={`w-2 h-2 rounded-full ${
              backendStatus === "connected"
                ? "bg-green-400"
                : backendStatus === "disconnected"
                ? "bg-red-400"
                : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
        {backendStatus === "disconnected" && (
          <button
            onClick={checkBackendHealth}
            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
          >
            Retry Connection
          </button>
        )}
      </div>
    </div>
  );
};
