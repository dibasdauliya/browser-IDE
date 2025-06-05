import { useState, useEffect, useCallback } from "react";
import type { FileItem, FileSystemState } from "../types";
import { DEFAULT_PYTHON_CODE } from "../constants/defaultCode";

const STORAGE_KEY = "browser-ide-files";

const createDefaultFile = (): FileItem => ({
  id: "main-py",
  name: "main.py",
  content: DEFAULT_PYTHON_CODE,
  type: "file",
  extension: "py",
  lastModified: Date.now(),
});

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.substring(lastDot + 1) : "";
};

export const useFileSystem = () => {
  const [fileSystem, setFileSystem] = useState<FileSystemState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          files: parsed.files || [createDefaultFile()],
          activeFileId: parsed.activeFileId || "main-py",
          openFiles: parsed.openFiles || ["main-py"],
        };
      }
    } catch (error) {
      console.error("Failed to load files from localStorage:", error);
    }

    const defaultFile = createDefaultFile();
    return {
      files: [defaultFile],
      activeFileId: defaultFile.id,
      openFiles: [defaultFile.id],
    };
  });

  // Save to localStorage whenever fileSystem changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fileSystem));
    } catch (error) {
      console.error("Failed to save files to localStorage:", error);
    }
  }, [fileSystem]);

  const createFile = useCallback((name: string) => {
    const id = generateId();
    const extension = getFileExtension(name);

    const newFile: FileItem = {
      id,
      name,
      content: "",
      type: "file",
      extension,
      lastModified: Date.now(),
    };

    setFileSystem((prev) => ({
      ...prev,
      files: [...prev.files, newFile],
      activeFileId: id,
      openFiles: [...prev.openFiles, id],
    }));

    return id;
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFileSystem((prev) => {
      const remainingFiles = prev.files.filter((f) => f.id !== fileId);
      const remainingOpenFiles = prev.openFiles.filter((id) => id !== fileId);

      // If we're deleting the active file, set a new active file
      let newActiveFileId = prev.activeFileId;
      if (prev.activeFileId === fileId) {
        newActiveFileId =
          remainingOpenFiles.length > 0
            ? remainingOpenFiles[0]
            : remainingFiles.length > 0
            ? remainingFiles[0].id
            : null;
      }

      return {
        ...prev,
        files: remainingFiles,
        activeFileId: newActiveFileId,
        openFiles: remainingOpenFiles,
      };
    });
  }, []);

  const renameFile = useCallback((fileId: string, newName: string) => {
    const extension = getFileExtension(newName);

    setFileSystem((prev) => ({
      ...prev,
      files: prev.files.map((file) =>
        file.id === fileId
          ? { ...file, name: newName, extension, lastModified: Date.now() }
          : file
      ),
    }));
  }, []);

  const selectFile = useCallback((fileId: string) => {
    setFileSystem((prev) => {
      const isAlreadyOpen = prev.openFiles.includes(fileId);
      return {
        ...prev,
        activeFileId: fileId,
        openFiles: isAlreadyOpen ? prev.openFiles : [...prev.openFiles, fileId],
      };
    });
  }, []);

  const closeFile = useCallback((fileId: string) => {
    setFileSystem((prev) => {
      const newOpenFiles = prev.openFiles.filter((id) => id !== fileId);
      let newActiveFileId = prev.activeFileId;

      // If closing the active file, switch to another open file
      if (prev.activeFileId === fileId && newOpenFiles.length > 0) {
        newActiveFileId = newOpenFiles[newOpenFiles.length - 1];
      }

      return {
        ...prev,
        activeFileId: newActiveFileId,
        openFiles: newOpenFiles,
      };
    });
  }, []);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    setFileSystem((prev) => ({
      ...prev,
      files: prev.files.map((file) =>
        file.id === fileId
          ? { ...file, content, lastModified: Date.now() }
          : file
      ),
    }));
  }, []);

  const getActiveFile = useCallback(() => {
    return (
      fileSystem.files.find((f) => f.id === fileSystem.activeFileId) || null
    );
  }, [fileSystem.files, fileSystem.activeFileId]);

  const getOpenFiles = useCallback(() => {
    return fileSystem.openFiles
      .map((id) => fileSystem.files.find((f) => f.id === id))
      .filter(Boolean) as FileItem[];
  }, [fileSystem.files, fileSystem.openFiles]);

  return {
    files: fileSystem.files,
    activeFileId: fileSystem.activeFileId,
    openFiles: fileSystem.openFiles,
    createFile,
    deleteFile,
    renameFile,
    selectFile,
    closeFile,
    updateFileContent,
    getActiveFile,
    getOpenFiles,
  };
};
