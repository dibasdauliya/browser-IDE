import { CodeEditor } from "./CodeEditor";
import { ControlButtons } from "./ControlButtons";
import { FileTabs } from "./FileTabs";
import type { FileItem } from "../types";

interface FileEditorPanelProps {
  activeFile: FileItem | null;
  openFiles: FileItem[];
  onFileContentChange: (fileId: string, content: string) => void;
  onFileTabSelect: (fileId: string) => void;
  onFileTabClose: (fileId: string) => void;
  onRun: () => void;
  onClear: () => void;
  isRunning: boolean;
  pyodideReady: boolean;
  hideControls?: boolean;
}

export const FileEditorPanel = ({
  activeFile,
  openFiles,
  onFileContentChange,
  onFileTabSelect,
  onFileTabClose,
  onRun,
  onClear,
  isRunning,
  pyodideReady,
  hideControls = false,
}: FileEditorPanelProps) => {
  const handleCodeChange = (content: string) => {
    if (activeFile) {
      onFileContentChange(activeFile.id, content);
    }
  };

  return (
    <div className="h-full flex flex-col min-w-0">
      <FileTabs
        openFiles={openFiles}
        activeFileId={activeFile?.id || null}
        onTabSelect={onFileTabSelect}
        onTabClose={onFileTabClose}
      />

      <div className="flex-1 min-h-0">
        {activeFile ? (
          <CodeEditor
            code={activeFile.content}
            onChange={handleCodeChange}
            language={activeFile.extension}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-900 text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm">
                Create a new file or select an existing one to start coding
              </p>
            </div>
          </div>
        )}
      </div>

      {!hideControls && (
        <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {activeFile ? `Editing: ${activeFile.name}` : "No file selected"}
            </div>
            <ControlButtons
              onRun={onRun}
              onClear={onClear}
              isRunning={isRunning}
              pyodideReady={pyodideReady}
            />
          </div>
        </div>
      )}
    </div>
  );
};
