import { useState, useRef, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { DragProvider } from "./DragContext";

interface ResizablePanelsProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  initialLeftWidth?: number; // Percentage (0-100)
  minLeftWidth?: number; // Percentage
  minRightWidth?: number; // Percentage
}

export const ResizablePanels = ({
  leftPanel,
  rightPanel,
  initialLeftWidth = 50,
  minLeftWidth = 20,
  minRightWidth = 20,
}: ResizablePanelsProps) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      // Apply constraints
      const constrainedWidth = Math.max(
        minLeftWidth,
        Math.min(100 - minRightWidth, newLeftWidth)
      );

      setLeftWidth(constrainedWidth);
    },
    [isDragging, minLeftWidth, minRightWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <DragProvider isDragging={isDragging}>
      <div ref={containerRef} className="flex h-full w-full">
        {/* Left Panel */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="h-full overflow-hidden"
        >
          {leftPanel}
        </div>

        {/* Resizer */}
        <div
          className={`relative w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize transition-colors select-none ${
            isDragging ? "bg-blue-500" : ""
          }`}
          onMouseDown={handleMouseDown}
          style={{ touchAction: "none" }}
        >
          {/* Invisible wider hit area for easier clicking */}
          <div
            className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize"
            onMouseDown={handleMouseDown}
          />
          {/* Visual indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-8 bg-gray-500 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Right Panel */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="h-full overflow-hidden"
        >
          {rightPanel}
        </div>
      </div>
    </DragProvider>
  );
};
