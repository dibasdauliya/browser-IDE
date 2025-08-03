import { useState, useRef } from "react";
import {
  File,
  Plus,
  MoreVertical,
  Edit3,
  Trash2,
  FileText,
  Check,
  X,
  Upload,
  Download,
  FolderDown,
} from "lucide-react";
import type { FileExplorerProps } from "../types";

export const FileExplorer = ({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  onFileUpload,
  onFileDownload,
  onDownloadAll,
  defaultExtension = "py",
}: FileExplorerProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      const fileName = newFileName.trim().includes(".")
        ? newFileName.trim()
        : `${newFileName.trim()}.${defaultExtension}`;
      onFileCreate(fileName);
      setNewFileName("");
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setNewFileName("");
    setIsCreating(false);
  };

  const handleStartRename = (fileId: string, currentName: string) => {
    setEditingFileId(fileId);
    setEditingName(currentName);
    setOpenMenuId(null);
  };

  const handleRename = () => {
    if (editingFileId && editingName.trim()) {
      onFileRename(editingFileId, editingName.trim());
    }
    setEditingFileId(null);
    setEditingName("");
  };

  const handleCancelRename = () => {
    setEditingFileId(null);
    setEditingName("");
  };

  const handleDelete = (fileId: string) => {
    if (confirm("Are you sure you want to delete this file?")) {
      onFileDelete(fileId);
    }
    setOpenMenuId(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileUpload(Array.from(files));
    }
    // Reset the input so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (fileId: string) => {
    onFileDownload(fileId);
    setOpenMenuId(null);
  };

  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "py":
        return <FileText className="w-4 h-4 text-green-400" />;
      case "c":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "h":
        return <FileText className="w-4 h-4 text-blue-300" />;
      case "html":
        return <FileText className="w-4 h-4 text-orange-400" />;
      case "css":
        return <FileText className="w-4 h-4 text-purple-400" />;
      case "js":
        return <FileText className="w-4 h-4 text-yellow-400" />;
      default:
        return <File className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="h-full bg-gray-800 border-r border-gray-700 flex flex-col min-w-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-300">Files</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={handleUploadClick}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Upload files"
            >
              <Upload className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={onDownloadAll}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Download all files"
              disabled={files.length === 0}
            >
              <FolderDown
                className={`w-4 h-4 ${
                  files.length === 0 ? "text-gray-600" : "text-gray-400"
                }`}
              />
            </button>
            <button
              onClick={() => setIsCreating(true)}
              className="p-1 hover:bg-gray-700 rounded transition-colors"
              title="Create new file"
            >
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".py,.c,.h,.txt,.js,.ts,.json,.md,.yml,.yaml,.xml,.html,.css,.sh,.bat"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* File List */}
      <div className="flex-1 overflow-auto">
        {/* New file creation */}
        {isCreating && (
          <div className="px-3 py-2 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-green-400" />
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder={`filename.${defaultExtension}`}
                className="flex-1 bg-gray-700 text-white text-sm px-2 py-1 rounded border-none outline-none"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFile();
                  if (e.key === "Escape") handleCancelCreate();
                }}
              />
              <button
                onClick={handleCreateFile}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
              >
                <Check className="w-3 h-3 text-green-400" />
              </button>
              <button
                onClick={handleCancelCreate}
                className="p-1 hover:bg-gray-600 rounded transition-colors"
              >
                <X className="w-3 h-3 text-red-400" />
              </button>
            </div>
          </div>
        )}

        {/* File items */}
        {files.map((file) => (
          <div key={file.id} className="relative">
            <div
              className={`px-3 py-2 flex items-center space-x-2 hover:bg-gray-700 cursor-pointer group ${
                file.id === activeFileId ? "bg-blue-600 hover:bg-blue-600" : ""
              }`}
              onClick={() => onFileSelect(file.id)}
            >
              {getFileIcon(file.extension)}

              {editingFileId === file.id ? (
                <div className="flex-1 flex items-center space-x-1">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 bg-gray-700 text-white text-sm px-2 py-1 rounded border-none outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename();
                      if (e.key === "Escape") handleCancelRename();
                    }}
                  />
                  <button
                    onClick={handleRename}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                  >
                    <Check className="w-3 h-3 text-green-400" />
                  </button>
                  <button
                    onClick={handleCancelRename}
                    className="p-1 hover:bg-gray-600 rounded transition-colors"
                  >
                    <X className="w-3 h-3 text-red-400" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-300 truncate">
                    {file.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === file.id ? null : file.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all"
                  >
                    <MoreVertical className="w-3 h-3 text-gray-400" />
                  </button>
                </>
              )}
            </div>

            {/* Context menu */}
            {openMenuId === file.id && (
              <div className="absolute right-2 top-8 bg-gray-900 border border-gray-600 rounded-lg shadow-lg z-10 py-1 min-w-32">
                <button
                  onClick={() => handleDownload(file.id)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleStartRename(file.id, file.name)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Rename</span>
                </button>
                <button
                  onClick={() => handleDelete(file.id)}
                  className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Click outside to close menu */}
      {openMenuId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpenMenuId(null)}
        />
      )}
    </div>
  );
};
