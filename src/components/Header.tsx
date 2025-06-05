import type { HeaderProps } from "../types";

export const Header = ({ pyodideReady }: HeaderProps) => {
  return (
    <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Python Browser IDE</h1>
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
