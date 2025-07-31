import React, { useState } from "react";
import { Terminal, Package } from "lucide-react";
import { OutputPanel } from "./OutputPanel";
import { PackageManager } from "./PackageManager";

interface RightPanelProps {
  output: string;
  onClear: () => void;
  installedPackages: string[];
  onInstallPackage: (packageName: string) => Promise<boolean>;
  pyodideReady: boolean;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  output,
  onClear,
  installedPackages,
  onInstallPackage,
  pyodideReady,
}) => {
  const [activeTab, setActiveTab] = useState<"output" | "packages">("output");

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-700 bg-gray-800">
        <button
          onClick={() => setActiveTab("output")}
          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "output"
              ? "text-white bg-gray-900 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Output</span>
        </button>
        <button
          onClick={() => setActiveTab("packages")}
          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "packages"
              ? "text-white bg-gray-900 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Packages</span>
          {installedPackages.length > 0 && (
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
              {installedPackages.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "output" ? (
          <OutputPanel output={output} onClear={onClear} />
        ) : (
          <PackageManager
            installedPackages={installedPackages}
            onInstallPackage={onInstallPackage}
            isDisabled={!pyodideReady}
          />
        )}
      </div>
    </div>
  );
};
