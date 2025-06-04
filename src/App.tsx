import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    loadPyodide: () => Promise<any>;
  }
}

function App() {
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

    // Load Pyodide script
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

  const styles = {
    body: {
      fontFamily: "monospace",
      padding: "20px",
      background: "#1e1e1e",
      color: "#fff",
      minHeight: "100vh",
      margin: 0,
    },
    textarea: {
      width: "100%",
      height: "150px",
      background: "#2d2d2d",
      color: "#fff",
      border: "none",
      padding: "10px",
      fontSize: "14px",
      fontFamily: "monospace",
      resize: "vertical" as const,
    },
    button: {
      marginTop: "10px",
      padding: "8px 12px",
      fontSize: "14px",
      cursor: "pointer",
      background: "#007acc",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
    },
    pre: {
      background: "#111",
      padding: "10px",
      marginTop: "10px",
      whiteSpace: "pre-wrap" as const,
      overflow: "auto",
      maxHeight: "300px",
    },
  };

  return (
    <div style={styles.body}>
      <h2>Python Runner (Pyodide)</h2>
      <textarea
        ref={textareaRef}
        style={styles.textarea}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter your Python code here..."
      />
      <br />
      <button style={styles.button} onClick={runCode} disabled={!pyodideReady}>
        {pyodideReady ? "Run" : "Loading..."}
      </button>
      <pre style={styles.pre}>{output}</pre>
    </div>
  );
}

export default App;
