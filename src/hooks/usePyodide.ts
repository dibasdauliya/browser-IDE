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
  const [installedPackages, setInstalledPackages] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadPy = async () => {
      try {
        const pyodideInstance = await window.loadPyodide();

        // Install commonly used packages
        setOutput("Loading Pyodide and installing common packages...");

        // Install micropip first (it's usually already available)
        await pyodideInstance.loadPackage("micropip");

        // Common packages to pre-install
        const commonPackages = [
          "requests",
          "numpy",
          "pandas",
          "matplotlib",
          "beautifulsoup4",
        ];
        const installedSet = new Set<string>();

        for (const pkg of commonPackages) {
          try {
            await pyodideInstance.runPythonAsync(`
              import micropip
              await micropip.install("${pkg}")
            `);
            installedSet.add(pkg);
            setOutput((prev) => prev + `\n✓ Installed ${pkg}`);
          } catch (error) {
            console.warn(`Failed to install ${pkg}:`, error);
            setOutput((prev) => prev + `\n⚠ Failed to install ${pkg}`);
          }
        }

        setInstalledPackages(installedSet);
        setPyodide(pyodideInstance);
        setPyodideReady(true);
        setOutput(
          "Pyodide loaded successfully! Ready to run Python code.\nPre-installed packages: " +
            Array.from(installedSet).join(", ")
        );
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

  const installPackage = async (packageName: string): Promise<boolean> => {
    if (!pyodide || !pyodideReady) return false;

    try {
      setOutput((prev) => prev + `\n📦 Installing ${packageName}...`);

      await pyodide.runPythonAsync(`
        import micropip
        await micropip.install("${packageName}")
      `);

      setInstalledPackages((prev) => new Set([...prev, packageName]));
      setOutput((prev) => prev + `\n✓ Successfully installed ${packageName}`);
      return true;
    } catch (error) {
      setOutput(
        (prev) => prev + `\n❌ Failed to install ${packageName}: ${error}`
      );
      return false;
    }
  };

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
      const errorString = String(err);

      // Check if it's a missing module error and try to auto-install
      const moduleNotFoundMatch = errorString.match(
        /ModuleNotFoundError.*?'([^']+)'/
      );
      if (moduleNotFoundMatch) {
        const missingModule = moduleNotFoundMatch[1];
        setOutput(
          `❌ Module '${missingModule}' not found. Attempting to install automatically...\n`
        );

        const installed = await installPackage(missingModule);
        if (installed) {
          setOutput((prev) => prev + `\n🔄 Retrying code execution...\n`);
          // Retry the code execution
          try {
            await pyodide.runPythonAsync(code);
            setOutput(
              (prev) =>
                prev +
                `\n✅ Code executed successfully after installing ${missingModule}`
            );
          } catch (retryErr) {
            setOutput(
              (prev) =>
                prev +
                `\n❌ Code still failed after installing ${missingModule}:\n${retryErr}`
            );
          }
        }
      } else {
        setOutput(`Python Error:\n${err}`);
      }
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
    installPackage,
    installedPackages: Array.from(installedPackages),
  };
};
