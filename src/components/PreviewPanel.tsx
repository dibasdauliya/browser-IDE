import React, { useEffect, useRef, useState } from "react";
import { Eye, RefreshCw, Terminal, X, Trash2 } from "lucide-react";
import { useDragContext } from "./DragContext";
import { Console } from "./Console";
import type { ConsoleMessage } from "./Console";
import { VerticalResizablePanels } from "./VerticalResizablePanels";

interface PreviewPanelProps {
  previewContent: {
    html: string;
    css: string;
    js: string;
  };
  isAnyDragging?: boolean;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewContent,
  isAnyDragging = false,
}) => {
  const { isDragging } = useDragContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [consoleMessages, setConsoleMessages] = useState<ConsoleMessage[]>([]);
  const [isConsoleVisible, setIsConsoleVisible] = useState(true);
  const [isGlobalDragging, setIsGlobalDragging] = useState(false);

  // Check if any dragging is happening (horizontal, vertical, or global)
  const isAnyDragActive = isDragging || isAnyDragging || isGlobalDragging;

  const addConsoleMessage = (type: ConsoleMessage["type"], message: string) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
    };
    setConsoleMessages((prev) => [...prev, newMessage]);
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument;

    if (!document) return;

    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        ${previewContent.css}
    </style>
</head>
<body>
    ${previewContent.html}
    <script>
        // Override console methods to send messages to parent
        const originalConsole = {
            log: console.log.bind(console),
            error: console.error.bind(console),
            warn: console.warn.bind(console),
            info: console.info.bind(console)
        };

        const sendMessage = (type, ...args) => {
            // Call original console method
            originalConsole[type](...args);
            
            // Send to parent window
            const message = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch (e) {
                        return arg.toString();
                    }
                }
                return String(arg);
            }).join(' ');
            
            window.parent.postMessage({
                type: 'console',
                level: type,
                message: message
            }, '*');
        };

        console.log = (...args) => sendMessage('log', ...args);
        console.error = (...args) => sendMessage('error', ...args);
        console.warn = (...args) => sendMessage('warn', ...args);
        console.info = (...args) => sendMessage('info', ...args);

        // Execute the user's JavaScript code
        try {
            // Remove any existing error messages
            const errorDivs = document.querySelectorAll('[data-error-message]');
            errorDivs.forEach(div => div.remove());

            // Execute the code
            ${previewContent.js}
        } catch (error) {
            console.error('JavaScript Error:', error.message);
            const errorDiv = document.createElement('div');
            errorDiv.setAttribute('data-error-message', 'true');
            errorDiv.style.cssText = 'color: red; background: #fee; padding: 10px; margin: 10px 0; border: 1px solid #fcc; border-radius: 4px; font-family: monospace; white-space: pre-wrap;';
            errorDiv.innerHTML = '<strong>JavaScript Error:</strong><br>' + error.message;
            document.body.appendChild(errorDiv);
        }
    </script>
</body>
</html>
    `;

    // Update iframe content
    document.open();
    document.write(fullHTML);
    document.close();
  };

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "console") {
        addConsoleMessage(event.data.level, event.data.message);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Update preview when content changes
  useEffect(() => {
    updatePreview();
  }, [previewContent, isConsoleVisible]);

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const toggleConsole = () => {
    setIsConsoleVisible(!isConsoleVisible);
  };

  // stable preview section that contains the iframe
  const previewSection = (
    <>
      {/* Preview Content */}
      <div className="flex-1 min-h-0 bg-white min-w-0 relative">
        <iframe
          key="preview-iframe"
          ref={iframeRef}
          className="w-full h-full border-none min-w-0"
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
        />
        {/* Overlay to prevent iframe from capturing mouse events during drag */}
        {isAnyDragActive && (
          <div
            className="absolute inset-0 bg-transparent"
            style={{ cursor: "inherit" }}
          />
        )}
      </div>
    </>
  );

  const headerContent = (
    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium">Live Preview</span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const consoleHeader = (
    <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">Console</span>
          <span className="text-xs text-gray-500">
            ({consoleMessages.length} message
            {consoleMessages.length !== 1 ? "s" : ""})
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={clearConsole}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Clear console"
          >
            <Trash2 className="w-4 h-4 text-gray-400" />
          </button>
          <button
            onClick={toggleConsole}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Close console"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-900 min-w-0">
      {isConsoleVisible ? (
        <VerticalResizablePanels
          topPanel={
            <div className="h-full flex flex-col bg-gray-900 min-w-0 min-h-0">
              {headerContent}
              {previewSection}
            </div>
          }
          bottomPanel={
            <Console
              messages={consoleMessages}
              onClear={clearConsole}
              customHeader={consoleHeader}
            />
          }
          initialTopHeight={70}
          minTopHeight={30}
          minBottomHeight={20}
        />
      ) : (
        <div className="h-full flex flex-col bg-gray-900 min-w-0">
          {headerContent}
          {previewSection}
        </div>
      )}

      {!isConsoleVisible && (
        <button
          onClick={toggleConsole}
          className="fixed bottom-4 right-4 p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-all duration-200 shadow-lg"
          title="Show console"
        >
          <Terminal className="w-5 h-5 text-gray-300" />
        </button>
      )}
    </div>
  );
};
