export interface PyodideInstance {
  runPythonAsync: (code: string) => Promise<void>;
  setStdout: (handler: { batched: (s: string) => void }) => void;
  setStderr: (handler: { batched: (s: string) => void }) => void;
}

export interface PyodideState {
  pyodide: PyodideInstance | null;
  pyodideReady: boolean;
  isRunning: boolean;
  output: string;
}

export interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export interface OutputPanelProps {
  output: string;
  onClear: () => void;
}

export interface HeaderProps {
  pyodideReady: boolean;
}

export interface ControlButtonsProps {
  onRun: () => void;
  onClear: () => void;
  isRunning: boolean;
  pyodideReady: boolean;
}
