import { useEffect, useState } from "react";
import { detectScanfUsage } from "../utils/cCodeHelper";

interface CompilationResult {
  success: boolean;
  output?: string;
  error?: string;
  compilation_error?: string;
  error_output?: string;
  return_code?: number;
  needs_input?: boolean;
  message?: string;
}

interface CompilerStatus {
  available: boolean;
  version?: string;
  error?: string;
}

export const useBackendCCompiler = () => {
  const [compilerReady, setCompilerReady] = useState(false);
  const [output, setOutput] = useState("Checking C compiler...");
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilerStatus, setCompilerStatus] = useState<CompilerStatus>({
    available: false,
  });
  const [needsInput, setNeedsInput] = useState(false);
  const [pendingCode, setPendingCode] = useState("");

  const BACKEND_URL = "http://localhost:5001";

  useEffect(() => {
    const checkCompiler = async () => {
      try {
        setOutput("Checking C compiler availability...");

        const response = await fetch(`${BACKEND_URL}/api/check-c-compiler`);
        const status: CompilerStatus = await response.json();

        setCompilerStatus(status);

        if (status.available) {
          setCompilerReady(true);
          setOutput(
            `C compiler ready (${status.version}). You can now compile and run C code.`
          );
        } else {
          setCompilerReady(false);
          setOutput(
            `C compiler not available: ${status.error}\n\nPlease install gcc on your system to use the C compiler.`
          );
        }
      } catch (error) {
        console.error("Failed to check C compiler:", error);
        setCompilerReady(false);
        setOutput(
          "Failed to connect to C compiler service. Please ensure the backend server is running."
        );
      }
    };

    checkCompiler();
  }, []);

  const compileAndRun = async (code: string) => {
    if (!compilerReady || isRunning || isCompiling) return;

    setIsCompiling(true);
    setIsRunning(true);
    setOutput("Compiling C code...\n");

    try {
      const response = await fetch(`${BACKEND_URL}/api/compile-c`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const result: CompilationResult = await response.json();

      if (result.success) {
        setOutput(
          (prev) => prev + "\nCompilation successful! Running program...\n"
        );

        let finalOutput = result.output || "";
        if (result.error_output) {
          finalOutput += (finalOutput ? "\n" : "") + result.error_output;
        }

        setOutput((prev) => prev + "\n=== Program Output ===\n" + finalOutput);

        if (result.return_code !== 0) {
          setOutput(
            (prev) =>
              prev + `\n\nProgram exited with code: ${result.return_code}`
          );
        }
      } else {
        // Check if the program needs input
        if (result.needs_input) {
          setNeedsInput(true);
          setPendingCode(code);
          setOutput(
            (prev) => prev + "\n" + (result.message || "Program needs input")
          );
          return;
        }

        let errorMessage = "Compilation failed:\n";

        if (result.compilation_error) {
          errorMessage += result.compilation_error;
        } else if (result.error) {
          errorMessage += result.error;
        } else {
          errorMessage += "Unknown compilation error";
        }

        // Check if the error is related to scanf usage
        if (detectScanfUsage(code)) {
          errorMessage += "\n\n⚠️  Interactive Input Issue Detected:\n";
          errorMessage +=
            "Your program uses scanf() for input. You can now provide input values interactively!\n\n";
          errorMessage += "💡 How to use:\n";
          errorMessage += "• The program will prompt you for input values\n";
          errorMessage += "• Enter each value when prompted\n";
          errorMessage +=
            "• The program will continue execution with your input\n";
        }

        setOutput((prev) => prev + "\n" + errorMessage);
      }
    } catch (error) {
      setOutput((prev) => prev + "\nError: " + error);
    } finally {
      setIsCompiling(false);
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  const submitInput = async (inputs: string[]) => {
    if (!pendingCode || !needsInput) return;

    setIsRunning(true);
    setOutput(
      (prev) => prev + "\nProviding input and continuing execution...\n"
    );

    try {
      const response = await fetch(`${BACKEND_URL}/api/compile-c-with-input`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: pendingCode,
          inputs: inputs,
        }),
      });

      const result: CompilationResult = await response.json();

      if (result.success) {
        let finalOutput = result.output || "";
        if (result.error_output) {
          finalOutput += (finalOutput ? "\n" : "") + result.error_output;
        }

        setOutput((prev) => prev + "\n=== Program Output ===\n" + finalOutput);

        if (result.return_code !== 0) {
          setOutput(
            (prev) =>
              prev + `\n\nProgram exited with code: ${result.return_code}`
          );
        }
      } else {
        setOutput(
          (prev) => prev + "\nError: " + (result.error || "Unknown error")
        );
      }
    } catch (error) {
      setOutput((prev) => prev + "\nError: " + error);
    } finally {
      setIsRunning(false);
      setNeedsInput(false);
      setPendingCode("");
    }
  };

  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  };

  return {
    compilerReady,
    isRunning,
    isCompiling,
    output,
    compilerStatus,
    needsInput,
    compileAndRun,
    submitInput,
    clearOutput,
    checkBackendHealth,
  };
};
