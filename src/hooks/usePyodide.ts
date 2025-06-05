import { useEffect, useState } from "react";
import type { PyodideInstance } from "../types";

declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
  }
}

export const usePyodide = () => {
  const [pyodide, setPyodide] = useState<PyodideInstance | null>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [output, setOutput] = useState("Loading Pyodide...");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadPy = async () => {
      try {
        const pyodideInstance = await window.loadPyodide();
        setPyodide(pyodideInstance);
        setPyodideReady(true);
        setOutput("Pyodide loaded successfully! Ready to run Python code.");
      } catch (error) {
        setOutput("Error loading Pyodide: " + error);
      }
    };

    // Load Pyodide script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js";
    script.onload = () => loadPy();
    script.onerror = () => setOutput("Failed to load Pyodide script");
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const runCode = async (code: string) => {
    if (!pyodideReady || !pyodide || isRunning) return;

    setIsRunning(true);
    setOutput("🚀 Running code...\n");

    try {
      let outputBuffer = "";

      // Capture stdout with proper newline handling
      pyodide.setStdout({
        batched: (s: string) => {
          outputBuffer += s + "\n";
        },
      });

      // Capture stderr with proper newline handling
      pyodide.setStderr({
        batched: (s: string) => {
          outputBuffer += s + "\n";
        },
      });

      // Clear previous output and run code
      await pyodide.runPythonAsync(code);

      // Update output after execution completes
      if (outputBuffer.trim() === "") {
        setOutput("Code executed successfully (no output)");
      } else {
        setOutput(`Code executed successfully:\n${outputBuffer}`);
      }
    } catch (err) {
      setOutput(`Python Error:\n${err}`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput(
      pyodideReady ? "Ready to run Python code." : "Loading Pyodide..."
    );
  };

  return {
    pyodide,
    pyodideReady,
    isRunning,
    output,
    runCode,
    clearOutput,
  };
};
