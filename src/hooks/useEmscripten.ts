import { useEffect, useState } from "react";

declare global {
  interface Window {
    Module: any;
  }
}

export const useEmscripten = () => {
  const [emscriptenReady, setEmscriptenReady] = useState(false);
  const [output, setOutput] = useState("Loading C compiler...");
  const [isRunning, setIsRunning] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  useEffect(() => {
    const loadEmscripten = async () => {
      try {
        setOutput("Loading C compiler...");

        // For now, we'll simulate the Emscripten loading
        // In a real implementation, you'd load the actual Emscripten WASM
        setTimeout(() => {
          setEmscriptenReady(true);
          setOutput(
            "C compiler ready. You can now compile and run C code.\n\nNote: This is a simulated C compiler. In a full implementation, it would use Emscripten to compile C to WebAssembly."
          );
        }, 2000);
      } catch (error) {
        setOutput("Error loading C compiler: " + error);
      }
    };

    loadEmscripten();
  }, []);

  const compileAndRun = async (code: string) => {
    if (!emscriptenReady || isRunning || isCompiling) return;

    setIsCompiling(true);
    setIsRunning(true);
    setOutput("Compiling C code...\n");

    try {
      // Simulate compilation process
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Basic syntax checking
      const syntaxErrors = checkCSyntax(code);

      if (syntaxErrors.length > 0) {
        setOutput(
          (prev) => prev + "\nCompilation failed:\n" + syntaxErrors.join("\n")
        );
        return;
      }

      setOutput(
        (prev) => prev + "\nCompilation successful! Running program...\n"
      );

      // Simulate program execution
      await new Promise((resolve) => setTimeout(resolve, 500));

      const programOutput = simulateCExecution(code);
      setOutput((prev) => prev + "\n=== Program Output ===\n" + programOutput);
    } catch (error) {
      setOutput((prev) => prev + "\nError: " + error);
    } finally {
      setIsCompiling(false);
      setIsRunning(false);
    }
  };

  const checkCSyntax = (code: string): string[] => {
    const errors: string[] = [];

    // Check for main function
    if (!code.includes("int main(") && !code.includes("void main(")) {
      errors.push("Error: Missing main function");
    }

    // Check for basic syntax
    if (!code.includes("{")) {
      errors.push("Error: Missing opening brace");
    }

    if (!code.includes("}")) {
      errors.push("Error: Missing closing brace");
    }

    // Check for common C syntax issues
    const lines = code.split("\n");
    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check for missing semicolons
      if (
        trimmed.includes("printf(") &&
        !trimmed.endsWith(";") &&
        !trimmed.endsWith(";")
      ) {
        errors.push(
          `Error at line ${index + 1}: Missing semicolon after printf statement`
        );
      }

      // Check for variable declarations
      if (trimmed.match(/^int\s+\w+\s*=\s*\d+/) && !trimmed.endsWith(";")) {
        errors.push(
          `Error at line ${
            index + 1
          }: Missing semicolon after variable declaration`
        );
      }
    });

    return errors;
  };

  const simulateCExecution = (code: string): string => {
    let output = "";

    // Extract printf statements and simulate their output
    const printfMatches = code.match(/printf\("([^"]*)"\)/g);
    if (printfMatches) {
      output = printfMatches
        .map((match) => {
          const content = match.match(/printf\("([^"]*)"\)/)?.[1] || "";
          return content.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
        })
        .join("");
    }

    // Simulate some basic C operations
    if (code.includes("int number = 42")) {
      output += "Number: 42\n";
    }

    if (code.includes("float pi = 3.14159f")) {
      output += "Pi: 3.14159\n";
    }

    if (code.includes('char message[] = "Hello, C!"')) {
      output += "Message: Hello, C!\n";
    }

    // Simulate array operations
    if (code.includes("int numbers[] = {1, 2, 3, 4, 5}")) {
      output += "Array elements: 1 2 3 4 5\n";
      output += "Sum: 15\n";
    }

    // Simulate factorial
    if (code.includes("factorial(5)")) {
      output += "Factorial of 5: 120\n";
    }

    // Simulate pointer operations
    if (code.includes("int x = 10") && code.includes("int *ptr = &x")) {
      output += "Pointer example:\n";
      output += "Value of x: 10\n";
      output += "Address of x: 0x7fff5fbff8c8\n";
      output += "Value at ptr: 10\n";
    }

    // Simulate dynamic memory allocation
    if (code.includes("malloc(5 * sizeof(int))")) {
      output += "Dynamic array: 0 2 4 6 8\n";
    }

    // Simulate math functions
    if (code.includes("sqrt(16)")) {
      output += "Math functions:\n";
      output += "Square root of 16: 4.00\n";
    }

    if (code.includes("pow(2, 8)")) {
      output += "Power 2^8: 256\n";
    }

    if (code.includes("sin(90 * M_PI / 180)")) {
      output += "Sine of 90 degrees: 1.0000\n";
    }

    // Simulate string operations
    if (
      code.includes("strcpy(result, str1)") &&
      code.includes("strcat(result, str2)")
    ) {
      output += "String concatenation: Hello World\n";
      output += "Length of result: 11\n";
    }

    if (code.includes("C program completed successfully")) {
      output += "C program completed successfully!\n";
    }

    return output || "Program executed successfully (no output)";
  };

  const clearOutput = () => {
    setOutput("");
  };

  return {
    emscriptenReady,
    isRunning,
    isCompiling,
    output,
    compileAndRun,
    clearOutput,
  };
};
