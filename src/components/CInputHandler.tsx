import React, { useState, useEffect } from "react";
import { Play, X, ArrowRight } from "lucide-react";

interface CInputHandlerProps {
  onSubmit: (inputs: string[]) => void;
  onCancel: () => void;
  isRunning: boolean;
  code?: string;
}

export const CInputHandler: React.FC<CInputHandlerProps> = ({
  onSubmit,
  onCancel,
  isRunning,
  code,
}) => {
  const [inputs, setInputs] = useState<string[]>([]);
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [isWaitingForInput, setIsWaitingForInput] = useState(true);

  // Extract printf text before scanf calls to use as placeholders
  useEffect(() => {
    if (code) {
      const extractedPlaceholders = extractPrintfPlaceholders(code);
      setPlaceholders(extractedPlaceholders);
    }
  }, [code]);

  const extractPrintfPlaceholders = (cCode: string): string[] => {
    const placeholders: string[] = [];
    const lines = cCode.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Look for printf statements with different patterns
      const printfPatterns = [
        /printf\("([^"]*)"\)/, // printf("text")
        /printf\('([^']*)'\)/, // printf('text')
        /printf\("([^"]*)"\s*,/, // printf("text", variable)
        /printf\('([^']*)'\s*,/, // printf('text', variable)
      ];

      for (const pattern of printfPatterns) {
        const printfMatch = line.match(pattern);
        if (printfMatch) {
          const printfText = printfMatch[1];

          // Check if the next few lines have scanf
          let hasScanf = false;
          for (let j = i; j < Math.min(i + 3, lines.length); j++) {
            if (lines[j].includes("scanf(")) {
              hasScanf = true;
              break;
            }
          }

          if (hasScanf) {
            // Clean up the printf text (remove escape sequences)
            const cleanText = printfText
              .replace(/\\n/g, " ")
              .replace(/\\t/g, " ")
              .replace(/\\"/g, '"')
              .replace(/\\'/g, "'")
              .replace(/\\r/g, " ")
              .trim();

            if (cleanText && !placeholders.includes(cleanText)) {
              placeholders.push(cleanText);
            }
          }
        }
      }
    }

    return placeholders;
  };

  const handleSubmitCurrentInput = () => {
    if (currentInput.trim()) {
      const newInputs = [...inputs, currentInput.trim()];
      setInputs(newInputs);
      setCurrentInput("");

      // Check if we have more inputs to collect
      if (newInputs.length < placeholders.length) {
        setCurrentInputIndex(newInputs.length);
      } else {
        // All inputs collected, submit
        setIsWaitingForInput(false);
        onSubmit(newInputs);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitCurrentInput();
    }
  };

  const handleSkipRemaining = () => {
    // Submit with current inputs and empty strings for remaining
    const remainingCount = Math.max(0, placeholders.length - inputs.length);
    const remainingInputs = Array(remainingCount).fill("");
    const allInputs = [...inputs, ...remainingInputs];
    onSubmit(allInputs);
  };

  const currentPlaceholder = placeholders[currentInputIndex] || "Enter value";
  const isLastInput = currentInputIndex >= placeholders.length - 1;
  const hasMoreInputs = currentInputIndex < placeholders.length;

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">
          Interactive Input Required
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors"
          disabled={isRunning}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-sm text-gray-400 mb-3">
        Your C program uses scanf() and needs input values. Enter each value
        when prompted:
      </p>

      {/* Progress indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>
            Input {currentInputIndex + 1} of {placeholders.length}
          </span>
          <span>
            {Math.round(((currentInputIndex + 1) / placeholders.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentInputIndex + 1) / placeholders.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Previous inputs */}
      {inputs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">
            Previous inputs:
          </h4>
          <div className="space-y-1">
            {inputs.map((input, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-gray-400 w-6">#{index + 1}:</span>
                <span className="text-gray-300 bg-gray-700 px-2 py-1 rounded">
                  {input}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current input */}
      {hasMoreInputs && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">
              #{currentInputIndex + 1}:
            </span>
            <span className="text-sm text-gray-300">{currentPlaceholder}</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={currentPlaceholder}
              className="flex-1 bg-gray-700 text-white text-sm px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              disabled={isRunning}
              autoFocus
            />
            <button
              onClick={handleSubmitCurrentInput}
              disabled={isRunning || !currentInput.trim()}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
            >
              {isLastInput ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run Program</span>
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4" />
                  <span>Next</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Press Enter to submit each input
        </div>
        <div className="flex items-center space-x-2">
          {hasMoreInputs && (
            <button
              onClick={handleSkipRemaining}
              disabled={isRunning}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              Skip remaining
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
