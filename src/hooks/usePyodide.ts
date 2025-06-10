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
  const [output, setOutput] = useState("Loading Python...");
  const [isRunning, setIsRunning] = useState(false);
  const [installedPackages, setInstalledPackages] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadPy = async () => {
      try {
        const pyodideInstance = await window.loadPyodide();

        // Install commonly used packages
        setOutput("Loading Python and installing common packages...");

        // Install micropip first (it's usually already available)
        await pyodideInstance.loadPackage("micropip");

        // Configure basic Python environment
        await pyodideInstance.runPythonAsync(`
          import warnings
          import sys
          import builtins
          from io import StringIO
          
          # Disable common warnings that clutter user output
          warnings.filterwarnings("ignore", category=DeprecationWarning)
          warnings.filterwarnings("ignore", category=FutureWarning)
          
          # Patch input() function to work in browser environment
          def browser_input(prompt_text=""):
              """
              Browser-compatible input function using JavaScript prompt.
              """
              import js
              result = js.prompt(str(prompt_text))
              if result is None:
                  raise KeyboardInterrupt("Input cancelled by user")
              return str(result)
          
          # Replace built-in input with our browser version
          builtins.input = browser_input
        `);

        // Common packages to pre-install
        const commonPackages = ["requests", "numpy", "matplotlib"];
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

        // Configure urllib3 and requests after installation
        try {
          await pyodideInstance.runPythonAsync(`
            # Configure urllib3 and requests to suppress SSL warnings
            try:
              import urllib3
              urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
              
              # Additional urllib3 warning filters
              import warnings
              warnings.filterwarnings("ignore", category=UserWarning, module="urllib3")
            except ImportError:
              pass
              
            # Configure requests with better error handling
            try:
              import requests
              from requests.packages.urllib3.exceptions import InsecureRequestWarning
              requests.packages.urllib3.disable_warnings(InsecureRequestWarning)
              
              # Monkey patch requests to provide better error messages
              _original_request = requests.request
              def patched_request(*args, **kwargs):
                  try:
                      # Set a default timeout if none provided
                      if 'timeout' not in kwargs:
                          kwargs['timeout'] = 30
                      return _original_request(*args, **kwargs)
                  except Exception as e:
                      error_msg = str(e)
                      if "Connection aborted" in error_msg or "HTTPException" in error_msg:
                          raise Exception("Network Error: Unable to connect to the server. This could be due to network issues or server problems.")
                      elif "timeout" in error_msg.lower():
                          raise Exception("Timeout Error: The request took too long to complete. The server might be slow or unreachable.")
                      elif "SSL" in error_msg or "certificate" in error_msg:
                          raise Exception("SSL Error: There was a problem with the secure connection.")
                      else:
                          raise e
              requests.request = patched_request
            except ImportError:
              pass
            
            # Configure matplotlib for inline plotting
            try:
              import matplotlib
              import matplotlib.pyplot as plt
              import io
              import base64
              
              # Set matplotlib to use Agg backend (no GUI, renders to buffer)
              matplotlib.use('Agg')
              
              # Store reference to original show function
              _original_show = plt.show
              
              # Create custom show function that captures and displays plots
              def capture_show(*args, **kwargs):
                  """
                  Custom show function that captures matplotlib plots and displays them inline.
                  """
                  try:
                      # Get current figure
                      fig = plt.gcf()
                      
                      # If there's no figure content, skip
                      if not fig.get_axes():
                          return
                      
                      # Save plot to BytesIO buffer
                      buf = io.BytesIO()
                      fig.savefig(buf, format='png', dpi=150, bbox_inches='tight', 
                                facecolor='white', edgecolor='none')
                      buf.seek(0)
                      
                      # Encode as base64
                      img_data = base64.b64encode(buf.getvalue()).decode()
                      
                      # Display as HTML img tag
                      print(f'<img src="data:image/png;base64,{img_data}" style="max-width: 100%; height: auto; margin: 10px 0;"/>')
                      
                      # Clear the figure to prevent memory leaks
                      plt.clf()
                      
                  except Exception as e:
                      print(f"Error displaying plot: {e}")
                      # Fallback to original show if there's an error
                      _original_show(*args, **kwargs)
              
              # Replace plt.show with our custom function
              plt.show = capture_show
              
              # Also patch savefig to auto-display if needed
              _original_savefig = plt.savefig
              def auto_display_savefig(*args, **kwargs):
                  _original_savefig(*args, **kwargs)
                  # Auto-show after saving
                  capture_show()
              
              # Uncomment next line if you want savefig to also auto-display
              # plt.savefig = auto_display_savefig
              
            except ImportError:
              pass
          `);
        } catch (configError) {
          console.warn(
            "Warning: Could not configure SSL warning suppression:",
            configError
          );
        }

        setInstalledPackages(installedSet);
        setPyodide(pyodideInstance);
        setPyodideReady(true);
        setOutput(
          "Ready to run Python code. \nPre-installed packages: " +
            Array.from(installedSet).join(", ")
        );
      } catch (error) {
        setOutput("Error loading Python: " + error);
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

      // Install package with warning suppression
      await pyodide.runPythonAsync(`
        import warnings
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            import micropip
            await micropip.install("${packageName}")
      `);

      setInstalledPackages((prev) => new Set([...prev, packageName]));
      setOutput((prev) => prev + `\n✅ Successfully installed ${packageName}`);
      return true;
    } catch (error) {
      const cleanError = String(error).includes("No such package")
        ? `Package '${packageName}' not found in PyPI`
        : `Installation failed: ${error}`;
      setOutput(
        (prev) => prev + `\n❌ Failed to install ${packageName}: ${cleanError}`
      );
      return false;
    }
  };

  const formatError = (error: string): string => {
    // Clean up common error patterns for better user experience
    let cleanError = error;

    // Handle network/connection errors more clearly
    if (
      cleanError.includes("Connection aborted") ||
      cleanError.includes("HTTPException")
    ) {
      if (cleanError.includes("A network error occurred")) {
        return "❌ Network Error: Unable to connect to the server. Please check your internet connection or try again later.";
      }
      return "❌ Connection Error: The request was interrupted. This could be due to network issues or server problems.";
    }

    // Handle SSL/certificate errors
    if (cleanError.includes("SSL") || cleanError.includes("certificate")) {
      return "❌ SSL Error: There was a problem with the secure connection. This is often due to server configuration issues.";
    }

    // Handle timeout errors
    if (cleanError.includes("timeout") || cleanError.includes("TimeoutError")) {
      return "❌ Timeout Error: The request took too long to complete. The server might be slow or unreachable.";
    }

    // Handle requests library specific errors
    if (cleanError.includes("requests.exceptions")) {
      if (cleanError.includes("ConnectionError")) {
        return "❌ Connection Error: Unable to establish a connection to the server.";
      }
      if (cleanError.includes("RequestException")) {
        return "❌ Request Error: The HTTP request failed. Please check the URL and try again.";
      }
    }

    // Remove file paths from tracebacks for cleaner output
    cleanError = cleanError.replace(
      /File "\/lib\/python[\d.]+\/site-packages\/[^"]*", line \d+, in [^\n]*\n/g,
      ""
    );

    return cleanError;
  };

  const runCode = async (code: string) => {
    if (!pyodideReady || !pyodide || isRunning) return;

    setIsRunning(true);
    setOutput("🚀 Running code...\n");

    try {
      let outputBuffer = "";
      let errorBuffer = "";

      // Capture stdout with proper newline handling and filter warnings
      pyodide.setStdout({
        batched: (s: string) => {
          // Filter out urllib3 and other technical warnings
          if (
            !s.includes("InsecureRequestWarning") &&
            !s.includes("urllib3/connectionpool.py") &&
            !s.includes("warnings.warn") &&
            !s.includes("certificate verification")
          ) {
            outputBuffer += s + "\n";
          }
        },
      });

      // Capture stderr with filtering
      pyodide.setStderr({
        batched: (s: string) => {
          // Filter out warning messages but keep actual errors
          if (
            !s.includes("InsecureRequestWarning") &&
            !s.includes("urllib3/connectionpool.py") &&
            !s.includes("warnings.warn") &&
            !s.includes("certificate verification")
          ) {
            errorBuffer += s + "\n";
          }
        },
      });

      // Execute the code directly without extra wrapper
      await pyodide.runPythonAsync(code);

      // Combine output and filtered errors
      let finalOutput = outputBuffer.trim();
      if (errorBuffer.trim()) {
        finalOutput += (finalOutput ? "\n" : "") + errorBuffer.trim();
      }

      // Update output after execution completes
      if (finalOutput === "") {
        setOutput("=== Output ===\n(empty)");
      } else {
        setOutput(`=== Output ===\n${finalOutput}`);
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
          `❌ Module '${missingModule}' not found. Installing automatically...\n`
        );

        const installed = await installPackage(missingModule);
        if (installed) {
          setOutput((prev) => prev + `\n🔄 Retrying code execution...\n`);
          // Retry the code execution
          try {
            let retryOutputBuffer = "";
            pyodide.setStdout({
              batched: (s: string) => {
                if (
                  !s.includes("InsecureRequestWarning") &&
                  !s.includes("urllib3/connectionpool.py")
                ) {
                  retryOutputBuffer += s + "\n";
                }
              },
            });

            await pyodide.runPythonAsync(code);
            const retryOutput = retryOutputBuffer.trim();
            setOutput(
              (prev) =>
                prev +
                `\n✅ Code executed successfully after installing ${missingModule}` +
                (retryOutput ? `:\n${retryOutput}` : "")
            );
          } catch (retryErr) {
            const cleanRetryError = formatError(String(retryErr));
            setOutput(
              (prev) =>
                prev +
                `\n❌ Code failed after installing ${missingModule}:\n${cleanRetryError}`
            );
          }
        }
      } else {
        const cleanError = formatError(errorString);
        setOutput(`❌ Error:\n${cleanError}`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput(pyodideReady ? "Ready to run Python code." : "Loading Python...");
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
