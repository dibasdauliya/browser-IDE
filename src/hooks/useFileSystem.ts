import { useState, useEffect, useCallback } from "react";
import type { FileItem, FileSystemState } from "../types";
import { DEFAULT_PYTHON_CODE, DEFAULT_C_CODE } from "../constants/defaultCode";
import {
  DEFAULT_HTML_CODE,
  DEFAULT_CSS_CODE,
  DEFAULT_JS_CODE,
} from "../constants/defaultWebCode";

const STORAGE_KEY_PREFIX = "browser-ide-files";

const createDefaultFile = (storageKey?: string): FileItem => {
  if (storageKey === "html-playground") {
    return {
      id: "index-html",
      name: "index.html",
      content: DEFAULT_HTML_CODE,
      type: "file",
      extension: "html",
      lastModified: Date.now(),
    };
  }

  if (storageKey === "c-ide") {
    return {
      id: "main-c",
      name: "main.c",
      content: DEFAULT_C_CODE,
      type: "file",
      extension: "c",
      lastModified: Date.now(),
    };
  }

  return {
    id: "main-py",
    name: "main.py",
    content: DEFAULT_PYTHON_CODE,
    type: "file",
    extension: "py",
    lastModified: Date.now(),
  };
};

const createDefaultWebFiles = (): FileItem[] => [
  {
    id: "index-html",
    name: "index.html",
    content: DEFAULT_HTML_CODE,
    type: "file",
    extension: "html",
    lastModified: Date.now(),
  },
  {
    id: "style-css",
    name: "style.css",
    content: DEFAULT_CSS_CODE,
    type: "file",
    extension: "css",
    lastModified: Date.now(),
  },
  {
    id: "script-js",
    name: "script.js",
    content: DEFAULT_JS_CODE,
    type: "file",
    extension: "js",
    lastModified: Date.now(),
  },
];

const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.substring(lastDot + 1) : "";
};

export const useFileSystem = (storageKey?: string) => {
  const STORAGE_KEY = storageKey
    ? `${STORAGE_KEY_PREFIX}-${storageKey}`
    : STORAGE_KEY_PREFIX;

  const [fileSystem, setFileSystem] = useState<FileSystemState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          files: parsed.files || [createDefaultFile(storageKey)],
          activeFileId:
            parsed.activeFileId ||
            (storageKey === "html-playground"
              ? "index-html"
              : storageKey === "c-ide"
              ? "main-c"
              : "main-py"),
          openFiles:
            parsed.openFiles ||
            (storageKey === "html-playground"
              ? ["index-html"]
              : storageKey === "c-ide"
              ? ["main-c"]
              : ["main-py"]),
        };
      }
    } catch (error) {
      console.error("Failed to load files from localStorage:", error);
    }

    if (storageKey === "html-playground") {
      const defaultFiles = createDefaultWebFiles();
      return {
        files: defaultFiles,
        activeFileId: "index-html",
        openFiles: ["index-html"],
      };
    } else if (storageKey === "c-ide") {
      const defaultFile = createDefaultFile(storageKey);
      return {
        files: [defaultFile],
        activeFileId: defaultFile.id,
        openFiles: [defaultFile.id],
      };
    } else {
      const defaultFile = createDefaultFile(storageKey);
      return {
        files: [defaultFile],
        activeFileId: defaultFile.id,
        openFiles: [defaultFile.id],
      };
    }
  });

  // Save to localStorage whenever fileSystem changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fileSystem));
    } catch (error) {
      console.error("Failed to save files to localStorage:", error);
    }
  }, [fileSystem, STORAGE_KEY]);

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

  const uploadFiles = useCallback((files: File[]) => {
    files.forEach((file) => {
      const id = generateId();
      const extension = getFileExtension(file.name);

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;

        const newFile: FileItem = {
          id,
          name: file.name,
          content,
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
      };
      reader.readAsText(file);
    });
  }, []);

  const downloadFile = useCallback(
    (fileId: string) => {
      const file = fileSystem.files.find((f) => f.id === fileId);
      if (!file) return;

      const blob = new Blob([file.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [fileSystem.files]
  );

  const downloadAllFiles = useCallback(() => {
    if (fileSystem.files.length === 0) return;

    fileSystem.files.forEach((file) => {
      setTimeout(
        () => downloadFile(file.id),
        100 * fileSystem.files.indexOf(file)
      );
    });
  }, [fileSystem.files, downloadFile]);

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
    uploadFiles,
    downloadFile,
    downloadAllFiles,
  };
};
