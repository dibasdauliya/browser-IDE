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
  const [installingPackages, setInstallingPackages] = useState<Set<string>>(
    new Set()
  );
  const [newPackageName, setNewPackageName] = useState("");
  const [showInstallForm, setShowInstallForm] = useState(false);

  const handleInstallPackage = async (packageName: string) => {
    if (isInstalling || installingPackages.has(packageName)) return;

    setIsInstalling(true);
    setInstallingPackages((prev) => new Set(prev).add(packageName));

    const success = await onInstallPackage(packageName);

    if (success) {
      if (packageName === newPackageName.trim()) {
        setNewPackageName("");
        setShowInstallForm(false);
      }
    }

    setIsInstalling(false);
    setInstallingPackages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(packageName);
      return newSet;
    });
  };

  const handleInstallNewPackage = async () => {
    const packageName = newPackageName.trim();
    if (!packageName || isInstalling) return;
    await handleInstallPackage(packageName);
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
    <div className="bg-gray-800 border-t border-gray-700 p-4 max-h-60 overflow-y-auto">
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
                if (e.key === "Enter") handleInstallNewPackage();
                if (e.key === "Escape") handleCancel();
              }}
              autoFocus
            />
            <button
              onClick={handleInstallNewPackage}
              disabled={!newPackageName.trim() || isInstalling}
              className="p-1 hover:bg-gray-600 rounded transition-colors disabled:opacity-50"
            >
              {isInstalling && installingPackages.has(newPackageName.trim()) ? (
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
            {suggestedPackages.slice(0, 5).map((pkg) => {
              const isInstallingThis = installingPackages.has(pkg);
              return (
                <button
                  key={pkg}
                  onClick={() => handleInstallPackage(pkg)}
                  disabled={isDisabled || isInstallingThis}
                  className={`px-2 py-1 text-xs rounded border transition-colors flex items-center gap-1 ${
                    isInstallingThis
                      ? "bg-blue-700 text-blue-200 border-blue-600 cursor-not-allowed"
                      : isDisabled
                      ? "bg-gray-700 text-gray-500 border-gray-600 cursor-not-allowed opacity-50"
                      : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                  }`}
                >
                  {isInstallingThis ? (
                    <>
                      <Loader className="w-3 h-3 animate-spin" />
                      Installing...
                    </>
                  ) : (
                    `+ ${pkg}`
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
