import React, { useState } from "react";
import { Package, Plus, Check, X, Loader } from "lucide-react";

interface PackageManagerProps {
  installedPackages: string[];
  onInstallPackage: (packageName: string) => Promise<boolean>;
  isDisabled?: boolean;
}

export const PackageManager: React.FC<PackageManagerProps> = ({
  installedPackages,
  onInstallPackage,
  isDisabled = false,
}) => {
  const [isInstalling, setIsInstalling] = useState(false);
  const [newPackageName, setNewPackageName] = useState("");
  const [showInstallForm, setShowInstallForm] = useState(false);

  const handleInstallPackage = async () => {
    if (!newPackageName.trim() || isInstalling) return;

    setIsInstalling(true);
    const success = await onInstallPackage(newPackageName.trim());

    if (success) {
      setNewPackageName("");
      setShowInstallForm(false);
    }

    setIsInstalling(false);
  };

  const handleCancel = () => {
    setNewPackageName("");
    setShowInstallForm(false);
  };

  const commonPackages = [
    "requests",
    "numpy",
    "pandas",
    "matplotlib",
    "dibas",
    "scipy",
    "beautifulsoup4",
    "pillow",
    "openpyxl",
    "seaborn",
    "plotly",
  ];

  const suggestedPackages = commonPackages.filter(
    (pkg) => !installedPackages.includes(pkg)
  );

  return (
    <div className="bg-gray-800 border-t border-gray-700 p-4 max-h-48 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300 flex items-center">
          <Package className="w-4 h-4 mr-2" />
          Python Packages
        </h3>
        <button
          onClick={() => setShowInstallForm(!showInstallForm)}
          disabled={isDisabled}
          className={`p-1 hover:bg-gray-700 rounded transition-colors ${
            isDisabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Install new package"
        >
          <Plus className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Install new package form */}
      {showInstallForm && (
        <div className="mb-3 p-2 bg-gray-700 rounded">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newPackageName}
              onChange={(e) => setNewPackageName(e.target.value)}
              placeholder="Package name (e.g., requests)"
              className="flex-1 bg-gray-600 text-white text-xs px-2 py-1 rounded border-none outline-none"
              disabled={isInstalling}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleInstallPackage();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
            />
            <button
              onClick={handleInstallPackage}
              disabled={!newPackageName.trim() || isInstalling}
              className="p-1 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            >
              {isInstalling ? (
                <Loader className="w-3 h-3 text-blue-400 animate-spin" />
              ) : (
                <Check className="w-3 h-3 text-green-400" />
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isInstalling}
              className="p-1 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            >
              <X className="w-3 h-3 text-red-400" />
            </button>
          </div>
        </div>
      )}

      {/* Installed packages */}
      <div className="mb-3">
        <h4 className="text-xs text-gray-400 mb-2">
          Installed ({installedPackages.length})
        </h4>
        <div className="flex flex-wrap gap-1">
          {installedPackages.map((pkg) => (
            <span
              key={pkg}
              className="px-2 py-1 bg-green-900 text-green-200 text-xs rounded border border-green-700"
            >
              {pkg}
            </span>
          ))}
          {installedPackages.length === 0 && (
            <span className="text-xs text-gray-500">
              No packages installed yet
            </span>
          )}
        </div>
      </div>

      {/* Suggested packages */}
      {suggestedPackages.length > 0 && (
        <div>
          <h4 className="text-xs text-gray-400 mb-2">Quick Install</h4>
          <div className="flex flex-wrap gap-1">
            {suggestedPackages.slice(0, 5).map((pkg) => (
              <button
                key={pkg}
                onClick={() => onInstallPackage(pkg)}
                disabled={isDisabled || isInstalling}
                className={`px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded border border-gray-600 
                  hover:bg-gray-600 transition-colors ${
                    isDisabled || isInstalling
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
              >
                + {pkg}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
