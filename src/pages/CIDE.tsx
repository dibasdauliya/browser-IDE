import {
  Header,
  ResizablePanels,
  Navigation,
  FileExplorer,
  FileEditorPanel,
  RightPanel,
} from "../components";
import { useEmscripten, useFileSystem } from "../hooks";

export const CIDE = () => {
  const {
    emscriptenReady,
    isRunning,
    isCompiling,
    output,
    compileAndRun,
    clearOutput,
  } = useEmscripten();
  const {
    files,
    activeFileId,
    createFile,
    deleteFile,
    renameFile,
    selectFile,
    closeFile,
    updateFileContent,
    getActiveFile,
    getOpenFiles,
    uploadFiles,
    downloadFile,
    downloadAllFiles,
  } = useFileSystem();

  const activeFile = getActiveFile();
  const openFiles = getOpenFiles();

  const handleRunCode = () => {
    if (activeFile) {
      compileAndRun(activeFile.content);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col relative">
      <Header pyodideReady={emscriptenReady} leftContent={<Navigation />} />

      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanels
          initialLeftWidth={75}
          minLeftWidth={50}
          minRightWidth={25}
          leftPanel={
            <ResizablePanels
              initialLeftWidth={25}
              minLeftWidth={15}
              minRightWidth={40}
              leftPanel={
                <FileExplorer
                  files={files}
                  activeFileId={activeFileId}
                  onFileSelect={selectFile}
                  onFileCreate={createFile}
                  onFileDelete={deleteFile}
                  onFileRename={renameFile}
                  onFileUpload={uploadFiles}
                  onFileDownload={downloadFile}
                  onDownloadAll={downloadAllFiles}
                />
              }
              rightPanel={
                <FileEditorPanel
                  activeFile={activeFile}
                  openFiles={openFiles}
                  onFileContentChange={updateFileContent}
                  onFileTabSelect={selectFile}
                  onFileTabClose={closeFile}
                  onRun={handleRunCode}
                  onClear={clearOutput}
                  isRunning={isRunning || isCompiling}
                  pyodideReady={emscriptenReady}
                />
              }
            />
          }
          rightPanel={
            <RightPanel
              output={output}
              onClear={clearOutput}
              installedPackages={[]}
              onInstallPackage={async () => false}
              pyodideReady={emscriptenReady}
            />
          }
        />
      </div>
    </div>
  );
};
