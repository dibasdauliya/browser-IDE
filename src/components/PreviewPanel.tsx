import React, { useEffect, useRef, useState } from "react";
import { Eye, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
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

  const clearConsole = () => {
    setConsoleMessages([]);
  };

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument;

    if (!document) return;

    // Create the complete HTML document with console capture
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

        // Wrap user JS in try-catch to capture errors
        try {
            ${previewContent.js}
        } catch (error) {
            console.error('JavaScript Error:', error.message);
            document.body.innerHTML += '<div style="color: red; background: #fee; padding: 10px; margin: 10px 0; border: 1px solid #fcc; border-radius: 4px;"><strong>JavaScript Error:</strong> ' + error.message + '</div>';
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

  useEffect(() => {
    updatePreview();
  }, [previewContent]);

  useEffect(() => {
    // Small delay to ensure DOM is updated
    const timer = setTimeout(() => {
      updatePreview();
    }, 50);
    return () => clearTimeout(timer);
  }, [isConsoleVisible]);

  // Global drag detection by monitoring body cursor changes
  useEffect(() => {
    const checkDragState = () => {
      const bodyStyle = window.getComputedStyle(document.body);
      const cursor = bodyStyle.cursor;
      setIsGlobalDragging(cursor === "row-resize" || cursor === "col-resize");
    };

    // observer to watch for cursor changes
    const observer = new MutationObserver(checkDragState);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    // check periodically as a fallback
    const interval = setInterval(checkDragState, 50);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  const handleRefresh = () => {
    clearConsole();
    updatePreview();
  };

  const toggleConsole = () => {
    setIsConsoleVisible(!isConsoleVisible);
  };

  // Create a stable preview section that contains the iframe
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
            onClick={toggleConsole}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title={isConsoleVisible ? "Hide console" : "Show console"}
          >
            {isConsoleVisible ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </button>
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
            <Console messages={consoleMessages} onClear={clearConsole} />
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
    </div>
  );
};
