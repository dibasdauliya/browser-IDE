import { useState } from "react";
import {
  Header,
  ResizablePanels,
  EditorPanel,
  OutputPanel,
  Navigation,
} from "../components";
import { usePyodide } from "../hooks";
import { DEFAULT_PYTHON_CODE } from "../constants/defaultCode";

export const PythonIDE = () => {
  const [code, setCode] = useState(DEFAULT_PYTHON_CODE);
  const { pyodideReady, isRunning, output, runCode, clearOutput } =
    usePyodide();

  const handleRunCode = () => {
    runCode(code);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col relative">
      <Navigation />

      <Header pyodideReady={pyodideReady} />

      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanels
          initialLeftWidth={60}
          minLeftWidth={25}
          minRightWidth={25}
          leftPanel={
            <EditorPanel
              code={code}
              onChange={setCode}
              onRun={handleRunCode}
              onClear={clearOutput}
              isRunning={isRunning}
              pyodideReady={pyodideReady}
            />
          }
          rightPanel={<OutputPanel output={output} onClear={clearOutput} />}
        />
      </div>
    </div>
  );
};
