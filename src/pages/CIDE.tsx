import {
  Header,
  ResizablePanels,
  Navigation,
  FileExplorer,
  FileEditorPanel,
  RightPanel,
  CInputHandler,
  BackendStatusBar,
} from "../components";
import { useBackendCCompiler, useFileSystem } from "../hooks";

export const CIDE = () => {
  const {
    compilerReady,
    isRunning,
    isCompiling,
    output,
    needsInput,
    compileAndRun,
    submitInput,
    clearOutput,
  } = useBackendCCompiler();
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
  } = useFileSystem("c-ide");

  const activeFile = getActiveFile();
  const openFiles = getOpenFiles();

  const handleRunCode = () => {
    if (activeFile) {
      compileAndRun(activeFile.content);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col relative">
      <Header pyodideReady={compilerReady} leftContent={<Navigation />} />

      <div className="flex-1 min-h-0 overflow-hidden">
        <BackendStatusBar />
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
                  defaultExtension="c"
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
                  pyodideReady={compilerReady}
                />
              }
            />
          }
          rightPanel={
            <div className="flex flex-col h-full">
              {needsInput && (
                <CInputHandler
                  onSubmit={submitInput}
                  onCancel={() => {
                    // Reset the input state
                    clearOutput();
                  }}
                  isRunning={isRunning}
                  code={activeFile?.content}
                />
              )}
              <div className="flex-1 min-h-0">
                <RightPanel
                  output={output}
                  onClear={clearOutput}
                  installedPackages={[]}
                  onInstallPackage={async () => false}
                  pyodideReady={compilerReady}
                />
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
};
