import { Terminal } from "lucide-react";
import type { OutputPanelProps } from "../types";

export const OutputPanel = ({ output, onClear }: OutputPanelProps) => {
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
          <pre
            className="p-4 text-sm font-mono leading-relaxed text-green-400 min-h-full"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            dangerouslySetInnerHTML={{
              __html: output.replace(/\n/g, "<br/>"),
            }}
          />
        </div>
      </div>
    </div>
  );
};
