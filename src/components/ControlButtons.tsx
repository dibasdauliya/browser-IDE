import { Play } from "lucide-react";
import type { ControlButtonsProps } from "../types";

export const ControlButtons = ({
  onRun,
  isRunning,
  pyodideReady,
}: ControlButtonsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onRun}
        disabled={!pyodideReady || isRunning}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
      >
        <Play className="w-4 h-4" />
        <span>{isRunning ? "Running..." : "Run Code"}</span>
      </button>
    </div>
  );
};
