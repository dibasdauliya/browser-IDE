import { useState } from "react";
import { Header, CodeEditor, OutputPanel, ControlButtons } from "./components";
import { usePyodide } from "./hooks";
import { DEFAULT_PYTHON_CODE } from "./constants/defaultCode";

function App() {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const { pyodideReady, isRunning, output, runCode, clearOutput } =
    usePyodide();

  const handleRunCode = () => {
    runCode(code);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <Header pyodideReady={pyodideReady} />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col">
          <CodeEditor code={code} onChange={setCode} />
          <div className="bg-gray-800 px-4 py-2 border-t border-gray-700">
            <div className="flex items-center justify-end">
              <ControlButtons
                onRun={handleRunCode}
                onClear={clearOutput}
                isRunning={isRunning}
                pyodideReady={pyodideReady}
              />
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <OutputPanel output={output} onClear={clearOutput} />
      </div>
    </div>
  );
}

export default App;
