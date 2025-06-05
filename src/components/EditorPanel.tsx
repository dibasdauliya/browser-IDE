import { CodeEditor } from "./CodeEditor";
import { ControlButtons } from "./ControlButtons";

interface EditorPanelProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onClear: () => void;
  isRunning: boolean;
  pyodideReady: boolean;
}

export const EditorPanel = ({
  code,
  onChange,
  onRun,
  onClear,
  isRunning,
  pyodideReady,
}: EditorPanelProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <CodeEditor code={code} onChange={onChange} />
      </div>
      <div className="bg-gray-800 px-4 py-2 border-t border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-end">
          <ControlButtons
            onRun={onRun}
            onClear={onClear}
            isRunning={isRunning}
            pyodideReady={pyodideReady}
          />
        </div>
      </div>
    </div>
  );
};
