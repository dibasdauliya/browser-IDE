import { Terminal } from "lucide-react";
import type { OutputPanelProps } from "../types";

export const OutputPanel = ({ output, onClear }: OutputPanelProps) => {
  // Process output to handle both text and HTML content
  const processOutput = (text: string) => {
    // Convert newlines to <br/> tags for plain text parts
    // But preserve existing HTML tags (like <img>)
    return (
      text
        .replace(/\n/g, "<br/>")
        // Style matplotlib images with better spacing and borders
        .replace(
          /<img([^>]*)>/g,
          '<img$1 style="max-width: 100%; height: auto; margin: 15px 0; border: 1px solid #374151; border-radius: 8px; background: white; padding: 8px;">'
        )
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium">Output</span>
          </div>
          <button
            onClick={onClear}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="h-full bg-black overflow-auto">
          <div
            className="p-4 text-sm font-mono leading-relaxed text-green-400 min-h-full"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            dangerouslySetInnerHTML={{
              __html: processOutput(output),
            }}
          />
        </div>
      </div>
    </div>
  );
};
