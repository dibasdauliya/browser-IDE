import { Code } from "lucide-react";
import type { HeaderProps } from "../types";

export const Header = ({ pyodideReady }: HeaderProps) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Python Browser IDE</h1>
            <p className="text-gray-400 text-sm">Powered by Pyodide</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              pyodideReady
                ? "bg-green-900 text-green-200 border border-green-700"
                : "bg-yellow-900 text-yellow-200 border border-yellow-700"
            }`}
          >
            {pyodideReady ? "● Ready" : "● Loading..."}
          </div>
        </div>
      </div>
    </div>
  );
};
