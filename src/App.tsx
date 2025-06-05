import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { keymap } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import {
  autocompletion,
  completionKeymap,
  closeBrackets,
  closeBracketsKeymap,
} from "@codemirror/autocomplete";
import {
  foldGutter,
  indentOnInput,
  bracketMatching,
  foldKeymap,
} from "@codemirror/language";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/view";
import { Play, Terminal, Code } from "lucide-react";

declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
  }
}

function App() {
  const [pyodide, setPyodide] = useState<any>(null);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [code, setCode] = useState(`# Welcome to Python Browser IDE! 🐍
import math
from datetime import datetime

# Variables and basic types
name = "Pyodide"
version = 2024
pi_value = 3.14159
is_awesome = True

print(f"Hello from {name}! 🚀")
print(f"Current time: {datetime.now()}")

# Function definition
def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

# Class definition
class Calculator:
    def __init__(self, name):
        self.name = name
    
    def add(self, a, b):
        return a + b
    
    def multiply(self, a, b):
        return a * b

# Main execution
if __name__ == "__main__":
    # Create calculator instance
    calc = Calculator("MyCalc")
    
    # List comprehension
    squares = [x**2 for x in range(1, 6)]
    print(f"Squares: {squares}")
    
    # Dictionary
    colors = {
        "red": "#FF0000",
        "green": "#00FF00", 
        "blue": "#0000FF"
    }
    
    # Loop through dictionary
    for color, hex_code in colors.items():
        print(f"{color}: {hex_code}")
    
    # Calculate some values
    result = calc.add(10, 20)
    fib_10 = calculate_fibonacci(10)
    
    print(f"\\nCalculation results:")
    print(f"10 + 20 = {result}")
    print(f"Fibonacci(10) = {fib_10}")
    print(f"π = {math.pi:.4f}")
`);
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

  const runCode = async () => {
    if (!pyodideReady || !pyodide || isRunning) return;

    setIsRunning(true);
    setOutput("🚀 Running code...\n");

    try {
      let outputBuffer = "";

      // Capture stdout with proper newline handling
      pyodide.setStdout({
        batched: (s: string) => {
          // Each batched call is a separate line, so add newline after each
          outputBuffer += s + "\n";
        },
      });

      // Capture stderr with proper newline handling
      pyodide.setStderr({
        batched: (s: string) => {
          // Each batched call is a separate line, so add newline after each
          outputBuffer += s + "\n";
        },
      });

      // Clear previous output and run code
      await pyodide.runPythonAsync(code);

      // Update output after execution completes
      if (outputBuffer.trim() === "") {
        setOutput("Code executed successfully (no output)");
      } else {
        // Keep the output as-is, now with proper newlines
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Python Browser IDE</h1>
              <p className="text-gray-400 text-sm">Powered by Pyodide</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                pyodideReady
                  ? "bg-green-900 text-green-200 border border-green-700"
                  : "bg-yellow-900 text-yellow-200 border border-yellow-700"
              }`}
            >
              {pyodideReady ? "● Ready" : "● Loading..."}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)]">
        {/* Code Editor Panel */}
        <div className="flex-1 flex flex-col">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Python Editor</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={runCode}
                  disabled={!pyodideReady || isRunning}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>{isRunning ? "Running..." : "Run Code"}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <CodeMirror
              value={code}
              height="100%"
              theme={oneDark}
              extensions={[
                python(),
                lineNumbers(),
                highlightActiveLineGutter(),
                history(),
                foldGutter(),
                indentOnInput(),
                bracketMatching(),
                closeBrackets(),
                autocompletion(),
                highlightSelectionMatches(),
                keymap.of([
                  ...defaultKeymap,
                  ...searchKeymap,
                  ...historyKeymap,
                  ...foldKeymap,
                  ...completionKeymap,
                  ...closeBracketsKeymap,
                ]),
              ]}
              onChange={(value) => setCode(value)}
              className="h-full"
            />
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:w-1/2 flex flex-col border-l border-gray-700">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">Output</span>
              </div>
              <button
                onClick={clearOutput}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="flex-1 bg-black overflow-auto">
            <pre
              className="p-4 text-sm font-mono leading-relaxed text-green-400"
              style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
              dangerouslySetInnerHTML={{
                __html: output.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
