import { useState, useEffect } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { OutputPanel } from "../components/OutputPanel";
import { Header } from "../components/Header";
import { ControlButtons } from "../components/ControlButtons";
import { Navigation } from "../components/Navigation";
import { ResizablePanels } from "../components/ResizablePanels";
import { PackageManager } from "../components/PackageManager";
import { BackendStatusBar } from "../components/BackendStatusBar";
import { Package, Terminal } from "lucide-react";
import { DEFAULT_PYTHON_CODE } from "../constants/defaultCode";

interface ExecutionResult {
  output: string;
  error: string;
  exit_code: number;
  execution_time: number;
}

interface PackageInstallResult {
  success: boolean;
  message?: string;
  error?: string;
  output?: string;
}

interface PackageListResult {
  success: boolean;
  packages?: string[];
  error?: string;
}

export function BackendPythonIDE() {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");

  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"output" | "packages">("output");

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/health");
      if (response.ok) {
        setBackendStatus("connected");
        return true;
      }
    } catch (error) {
      setBackendStatus("disconnected");
      return false;
    }
    return false;
  };

  // Handle backend status change
  const handleBackendStatusChange = (
    status: "unknown" | "connected" | "disconnected"
  ) => {
    setBackendStatus(status);
  };

  // Handle backend connection
  const handleBackendConnect = () => {
    loadInstalledPackages();
  };

  // Load installed packages from backend
  const loadInstalledPackages = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/list-packages");
      const result: PackageListResult = await response.json();

      if (result.success && result.packages) {
        // console.log("packages", result.packages);
        // console.log("all_packages", result.all_packages);
        setInstalledPackages(result.packages);
      }
    } catch (error) {
      console.error("Failed to load packages:", error);
    }
  };

  // Install package via backend API
  const installPackage = async (packageName: string): Promise<boolean> => {
    try {
      setOutput((prev) => prev + `\n📦 Installing ${packageName}...`);

      const response = await fetch(
        "http://localhost:5001/api/install-package",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ package: packageName }),
        }
      );

      const result: PackageInstallResult = await response.json();

      if (result.success) {
        setOutput(
          (prev) => prev + `\n✅ Successfully installed ${packageName}`
        );
        // Reload the package list
        await loadInstalledPackages();
        return true;
      } else {
        setOutput(
          (prev) =>
            prev +
            `\n❌ Failed to install ${packageName}: ${
              result.error || "Unknown error"
            }`
        );
        return false;
      }
    } catch (error) {
      setOutput(
        (prev) =>
          prev +
          `\n❌ Failed to install ${packageName}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
      );
      return false;
    }
  };

  // Execute code on backend
  const executeCode = async () => {
    setIsRunning(true);
    setOutput("Executing code on backend...\n");

    try {
      // First check if backend is available
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        setOutput(
          "❌ Backend server is not running!\n\nPlease start the backend server:\n\n1. Navigate to the backend directory\n2. Create a virtual environment: python -m venv venv\n3. Activate it: source venv/bin/activate (or venv\\Scripts\\activate on Windows)\n4. Install dependencies: pip install -r requirements.txt\n5. Start server: python app.py\n\nThe server should be running on http://localhost:5001"
        );
        return;
      }

      const response = await fetch("http://localhost:5001/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result: ExecutionResult = await response.json();

      let outputText = "";

      if (result.output) {
        outputText += result.output;
      }

      if (result.error) {
        outputText += `\n❌ Error:\n${result.error}`;
      }

      outputText += `\n\n Execution completed in ${result.execution_time}s (Exit code: ${result.exit_code})`;

      setOutput(outputText);
    } catch (error) {
      setOutput(
        `❌ Failed to execute code:\n${
          error instanceof Error ? error.message : "Unknown error"
        }\n\nMake sure the backend server is running on http://localhost:5001`
      );
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  // Check backend status on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header
        pyodideReady={backendStatus === "connected"}
        leftContent={<Navigation />}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Status Bar */}
        <BackendStatusBar
          onStatusChange={handleBackendStatusChange}
          onConnect={handleBackendConnect}
        />

        <div className="flex-1 min-h-0">
          <ResizablePanels
            initialLeftWidth={60}
            minLeftWidth={40}
            minRightWidth={30}
            leftPanel={
              <div className="h-full flex flex-col bg-gray-900">
                <div className="flex-1 min-h-0">
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    language="python"
                  />
                </div>
                <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 flex-shrink-0">
                  <div className="flex items-center justify-end text-white">
                    <ControlButtons
                      onRun={executeCode}
                      onClear={clearOutput}
                      isRunning={isRunning}
                      pyodideReady={backendStatus === "connected"}
                    />
                  </div>
                </div>
              </div>
            }
            rightPanel={
              <div className="h-full flex flex-col border-l border-gray-700 min-w-0 text-white">
                {/* Tab Navigation */}
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
                <div className="flex-1 min-h-0">
                  {activeTab === "output" ? (
                    <OutputPanel output={output} onClear={clearOutput} />
                  ) : (
                    <PackageManager
                      installedPackages={installedPackages}
                      onInstallPackage={installPackage}
                      isDisabled={backendStatus !== "connected"}
                    />
                  )}
                </div>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
