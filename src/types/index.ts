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

export interface FileItem {
  id: string;
  name: string;
  content: string;
  type: "file";
  extension: string;
  isActive?: boolean;
  lastModified: number;
}

export interface FileSystemState {
  files: FileItem[];
  activeFileId: string | null;
  openFiles: string[]; // Array of file IDs that are open in tabs
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
  leftContent?: React.ReactNode;
}

export interface ControlButtonsProps {
  onRun: () => void;
  onClear: () => void;
  isRunning: boolean;
  pyodideReady: boolean;
}

export interface FileExplorerProps {
  files: FileItem[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (name: string) => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
}

export interface FileTabsProps {
  openFiles: FileItem[];
  activeFileId: string | null;
  onTabSelect: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
}
