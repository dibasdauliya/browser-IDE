import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
  }
}

export function PythonIDE() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [code, setCode] = useState("print('Hello from Pyodide!')");
  const [output, setOutput] = useState("Loading Pyodide...");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadPy = async () => {
      try {
        const pyodideInstance = await window.loadPyodide();
        setPyodide(pyodideInstance);
        setPyodideReady(true);
        setOutput("Pyodide loaded. Ready to run Python.");
      } catch (error) {
        setOutput("Error loading Pyodide: " + error);
      }
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
    script.onload = () => loadPy();
    script.onerror = () => setOutput("Failed to load Pyodide script");
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const runCode = async () => {
    if (!pyodideReady || !pyodide) return;

    try {
      pyodide.setStdout({
        batched: (s: string) => {
          setOutput((prev) => prev + s);
        },
      });
      pyodide.setStderr({
        batched: (s: string) => {
          setOutput((prev) => prev + s);
        },
      });
      setOutput("");
      await pyodide.runPythonAsync(code);
    } catch (err) {
      setOutput("Error:\n" + err);
    }
  };

  return (
    <div className="font-mono p-5 bg-[#1e1e1e] text-white min-h-screen">
      <textarea
        ref={textareaRef}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your Python code here..."
        className="w-full h-40 bg-[#2d2d2d] text-white border-none p-2 text-sm resize-y rounded"
      />
      <button
        onClick={runCode}
        disabled={!pyodideReady}
        className={`mt-3 px-4 py-2 text-sm rounded ${
          pyodideReady
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-600 cursor-not-allowed"
        } text-white`}
      >
        {pyodideReady ? "Run" : "Loading..."}
      </button>
      <pre className="bg-black p-3 mt-3 whitespace-pre-wrap overflow-auto max-h-[300px] rounded">
        {output}
      </pre>
    </div>
  );
}
