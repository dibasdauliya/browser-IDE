import { X, FileText } from "lucide-react";
import type { FileTabsProps } from "../types";

export const FileTabs = ({
  openFiles,
  activeFileId,
  onTabSelect,
  onTabClose,
}: FileTabsProps) => {
  if (openFiles.length === 0) {
    return (
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
        <div className="text-sm text-gray-500">No files open</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border-b border-gray-700 flex overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`
            relative flex items-center space-x-2 px-3 py-2 border-r border-gray-700 
            cursor-pointer group min-w-0 flex-shrink-0 hover:bg-gray-700
            ${
              file.id === activeFileId
                ? "bg-gray-900 border-b-2 border-b-blue-500"
                : ""
            }
          `}
          onClick={() => onTabSelect(file.id)}
        >
          <FileText className="w-4 h-4 text-green-400 flex-shrink-0" />
          <span className="text-sm text-gray-300 truncate max-w-32">
            {file.name}
          </span>

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(file.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-600 rounded transition-all flex-shrink-0"
          >
            <X className="w-3 h-3 text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
};
