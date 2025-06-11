import React from "react";
import { Terminal, Trash2 } from "lucide-react";

export interface ConsoleMessage {
  id: string;
  type: "log" | "error" | "warn" | "info";
  message: string;
  timestamp: Date;
}

interface ConsoleProps {
  messages: ConsoleMessage[];
  onClear: () => void;
}

export const Console: React.FC<ConsoleProps> = ({ messages, onClear }) => {
  const getMessageStyle = (type: ConsoleMessage["type"]) => {
    switch (type) {
      case "error":
        return "text-red-400 bg-red-900/20 border-l-red-400";
      case "warn":
        return "text-yellow-400 bg-yellow-900/20 border-l-yellow-400";
      case "info":
        return "text-blue-400 bg-blue-900/20 border-l-blue-400";
      default:
        return "text-gray-300 bg-gray-800/50 border-l-gray-400";
    }
  };

  const formatTime = (date: Date) => {
    return date.toTimeString().split(" ")[0];
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 min-w-0 min-h-0">
      {/* Console Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Console</span>
            <span className="text-xs text-gray-500">
              ({messages.length} message{messages.length !== 1 ? "s" : ""})
            </span>
          </div>
          <button
            onClick={onClear}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 overflow-auto font-mono text-sm min-h-0">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No console output</p>
              <p className="text-xs mt-1">
                Use console.log() in your JavaScript to see output here
              </p>
            </div>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded border-l-2 text-sm ${getMessageStyle(
                  msg.type
                )}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="break-words whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
