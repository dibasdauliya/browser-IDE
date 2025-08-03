import { useState, useEffect } from "react";
import { OutputPanel } from "../components/OutputPanel";
import { Header } from "../components/Header";
import { Navigation } from "../components/Navigation";
import { ResizablePanels } from "../components/ResizablePanels";
import { PackageManager } from "../components/PackageManager";
import { BackendStatusBar } from "../components/BackendStatusBar";
import { FileExplorer } from "../components/FileExplorer";
import { FileEditorPanel } from "../components/FileEditorPanel";
import { Package, Terminal } from "lucide-react";
import config from "../config/environment";
import { useFileSystem } from "../hooks";

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
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");

  const [installedPackages, setInstalledPackages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"output" | "packages">("output");

  // Add file system functionality
  const {
    files,
    activeFileId,
    createFile,
    deleteFile,
    renameFile,
    selectFile,
    closeFile,
    updateFileContent,
    getActiveFile,
    getOpenFiles,
    uploadFiles,
    downloadFile,
    downloadAllFiles,
  } = useFileSystem("backend-python");

  const activeFile = getActiveFile();
  const openFiles = getOpenFiles();

  // Check backend health
  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${config.BACKEND_URL}/api/health`);
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
      const response = await fetch(`${config.BACKEND_URL}/api/list-packages`);
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
        `${config.BACKEND_URL}/api/install-package`,
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

  // Execute code on backend - updated to use active file
  const executeCode = async () => {
    if (!activeFile) {
      setOutput("❌ No file selected for execution");
      return;
    }

    setIsRunning(true);
    setOutput("Executing code on backend...\n");

    try {
      // First check if backend is available
      const isHealthy = await checkBackendHealth();
      if (!isHealthy) {
        setOutput(
          `❌ Backend server is not running!\n\nPlease start the backend server:\n\n1. Navigate to the backend directory\n2. Create a virtual environment: python -m venv venv\n3. Activate it: source venv/bin/activate (or venv\\Scripts\\activate on Windows)\n4. Install dependencies: pip install -r requirements.txt\n5. Start server: python app.py\n\nThe server should be running on ${config.BACKEND_URL}`
        );
        return;
      }

      const response = await fetch(`${config.BACKEND_URL}/api/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: activeFile.content }),
      });

      const result: ExecutionResult = await response.json();

      let outputText = "";

      if (result.output) {
        outputText += result.output;
      }

      if (result.error) {
        outputText += `\n❌ Error:\n${result.error}`;
      }

      outputText += `\n\n✅ Execution completed in ${result.execution_time}s (Exit code: ${result.exit_code})`;

      setOutput(outputText);
    } catch (error) {
      setOutput(
        `❌ Failed to execute code:\n${
          error instanceof Error ? error.message : "Unknown error"
        }\n\nMake sure the backend server is running on ${config.BACKEND_URL}`
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
            initialLeftWidth={75}
            minLeftWidth={50}
            minRightWidth={25}
            leftPanel={
              <ResizablePanels
                initialLeftWidth={25}
                minLeftWidth={15}
                minRightWidth={40}
                leftPanel={
                  <FileExplorer
                    files={files}
                    activeFileId={activeFileId}
                    onFileSelect={selectFile}
                    onFileCreate={createFile}
                    onFileDelete={deleteFile}
                    onFileRename={renameFile}
                    onFileUpload={uploadFiles}
                    onFileDownload={downloadFile}
                    onDownloadAll={downloadAllFiles}
                    defaultExtension="py"
                  />
                }
                rightPanel={
                  <FileEditorPanel
                    activeFile={activeFile}
                    openFiles={openFiles}
                    onFileContentChange={updateFileContent}
                    onFileTabSelect={selectFile}
                    onFileTabClose={closeFile}
                    onRun={executeCode}
                    onClear={clearOutput}
                    isRunning={isRunning}
                    pyodideReady={backendStatus === "connected"}
                  />
                }
              />
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
