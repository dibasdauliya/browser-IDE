import React, { useEffect, useRef } from "react";
import { Eye, RefreshCw } from "lucide-react";
import { useDragContext } from "./DragContext";

interface PreviewPanelProps {
  previewContent: {
    html: string;
    css: string;
    js: string;
  };
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  previewContent,
}) => {
  const { isDragging } = useDragContext();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const document = iframe.contentDocument;

    if (!document) return;

    // Create the complete HTML document
    const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
        }
        ${previewContent.css}
    </style>
</head>
<body>
    ${previewContent.html}
    <script>
        // Wrap user JS in try-catch to prevent errors from breaking the preview
        try {
            ${previewContent.js}
        } catch (error) {
            console.error('JavaScript Error:', error);
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

  // Update preview when content changes
  useEffect(() => {
    updatePreview();
  }, [previewContent]);

  const handleRefresh = () => {
    updatePreview();
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">Live Preview</span>
          </div>
          <button
            onClick={handleRefresh}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
            title="Refresh preview"
          >
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 min-h-0 bg-white min-w-0 relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-none min-w-0"
          title="HTML Preview"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
        />
        {/* Overlay to prevent iframe from capturing mouse events during drag */}
        {isDragging && (
          <div className="absolute inset-0 bg-transparent cursor-col-resize" />
        )}
      </div>
    </div>
  );
};
