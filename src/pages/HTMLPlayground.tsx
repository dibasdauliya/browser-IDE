import {
  Header,
  ResizablePanels,
  Navigation,
  FileExplorer,
  FileEditorPanel,
  PreviewPanel,
} from "../components";
import { useFileSystem } from "../hooks";

export const HTMLPlayground = () => {
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
  } = useFileSystem("html-playground");

  const activeFile = getActiveFile();
  const openFiles = getOpenFiles();

  const getPreviewContent = () => {
    const htmlFile = files.find((f) => f.extension === "html");
    const cssFile = files.find((f) => f.extension === "css");
    const jsFile = files.find((f) => f.extension === "js");

    const htmlContent =
      htmlFile?.content || "<h1>Create an HTML file to see preview</h1>";
    const cssContent = cssFile?.content || "";
    const jsContent = jsFile?.content || "";

    return {
      html: htmlContent,
      css: cssContent,
      js: jsContent,
    };
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col relative">
      <Header pyodideReady={true} leftContent={<Navigation />} />

      <div className="flex-1 min-h-0 overflow-hidden">
        <ResizablePanels
          initialLeftWidth={75}
          minLeftWidth={30}
          minRightWidth={15}
          leftPanel={
            <ResizablePanels
              initialLeftWidth={25}
              minLeftWidth={10}
              minRightWidth={20}
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
                  onRun={() => {}}
                  onClear={() => {}}
                  isRunning={false}
                  pyodideReady={true}
                  hideControls={true}
                />
              }
            />
          }
          rightPanel={<PreviewPanel previewContent={getPreviewContent()} />}
        />
      </div>
    </div>
  );
};
