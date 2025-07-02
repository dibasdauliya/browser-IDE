import { useState, useEffect } from "react";
import { CodeEditor } from "../components/CodeEditor";
import { OutputPanel } from "../components/OutputPanel";
import { Header } from "../components/Header";
import { ControlButtons } from "../components/ControlButtons";
import { Navigation } from "../components/Navigation";

const DEFAULT_BACKEND_CODE = `
import requests
import json
from datetime import datetime

print("Hello from the backend!")
print(f"Current time: {datetime.now()}")

numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Numbers: {numbers}")
print(f"Squared: {squared}")

# File operations (temporary files work)
import tempfile
import os

with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
    f.write("Hello from temporary file!")
    temp_path = f.name

with open(temp_path, 'r') as f:
    content = f.read()
    print(f"File content: {content}")

os.unlink(temp_path)  # Clean up

# Network requests
try:
    response = requests.get('https://httpbin.org/json', timeout=5)
    data = response.json()
    print(f"API Response: {data}")
except Exception as e:
    print(f"Network error: {e}")

# Libraries available
try:
    import numpy as np
    import matplotlib.pyplot as plt
    
    # Generate some data
    x = np.linspace(0, 10, 100)
    y = np.sin(x)
    
    print(f"NumPy array shape: {x.shape}")
    print(f"Sin values (first 5): {y[:5]}")
    
    # Create a matplotlib plot
    plt.figure(figsize=(10, 6))
    plt.plot(x, y, 'b-', linewidth=2, label='sin(x)')
    plt.plot(x, np.cos(x), 'r--', linewidth=2, label='cos(x)')
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('Sine and Cosine Functions')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.show()  # This will be captured and displayed in the frontend
    
except ImportError as e:
    print(f"Library not available: {e}")

print("\\nBackend execution completed!")`;

interface ExecutionResult {
  output: string;
  error: string;
  exit_code: number;
  execution_time: number;
}

export function BackendPythonIDE() {
  const [code, setCode] = useState(DEFAULT_BACKEND_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [backendStatus, setBackendStatus] = useState<
    "unknown" | "connected" | "disconnected"
  >("unknown");

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
    <div className="h-screen flex flex-col bg-gray-900">
      <Header
        pyodideReady={backendStatus === "connected"}
        leftContent={<Navigation />}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Status Bar */}
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

          <div className="text-sm text-gray-400">
            Server: http://localhost:5001
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Code Editor */}
          <div className="flex-1 flex flex-col min-w-0 relative">
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
              <h3 className="text-sm font-medium text-gray-300">
                Backend Python IDE
              </h3>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor code={code} onChange={setCode} language="python" />
            </div>

            {/* Fixed Control Buttons at Bottom */}
            {/* <div className="absolute bottom-4 right-4 z-10">
              <ControlButtons
                onRun={executeCode}
                onClear={clearOutput}
                isRunning={isRunning}
                pyodideReady={backendStatus === "connected"}
              />
            </div> */}

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

          {/* Right Panel - Output */}
          <div className="w-1/2 flex flex-col border-l border-gray-700 min-w-0 text-white">
            <OutputPanel output={output} onClear={clearOutput} />
          </div>
        </div>
      </div>
    </div>
  );
}
