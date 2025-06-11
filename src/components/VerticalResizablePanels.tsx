import { useState, useRef, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { DragProvider } from "./DragContext";

interface VerticalResizablePanelsProps {
  topPanel: ReactNode;
  bottomPanel: ReactNode;
  initialTopHeight?: number; // Percentage (0-100)
  minTopHeight?: number; // Percentage
  minBottomHeight?: number; // Percentage
}

export const VerticalResizablePanels = ({
  topPanel,
  bottomPanel,
  initialTopHeight = 70,
  minTopHeight = 30,
  minBottomHeight = 20,
}: VerticalResizablePanelsProps) => {
  const [topHeight, setTopHeight] = useState(initialTopHeight);
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
      const newTopHeight =
        ((e.clientY - containerRect.top) / containerRect.height) * 100;

      // Apply constraints
      const constrainedHeight = Math.max(
        minTopHeight,
        Math.min(100 - minBottomHeight, newTopHeight)
      );

      setTopHeight(constrainedHeight);
    },
    [isDragging, minTopHeight, minBottomHeight]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "row-resize";
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
      <div ref={containerRef} className="flex flex-col h-full w-full">
        {/* Top Panel */}
        <div
          style={{ height: `${topHeight}%` }}
          className="w-full overflow-hidden min-h-0"
        >
          {topPanel}
        </div>

        {/* Resizer */}
        <div
          className={`relative h-1 bg-gray-700 hover:bg-blue-500 cursor-row-resize transition-colors select-none ${
            isDragging ? "bg-blue-500" : ""
          }`}
          onMouseDown={handleMouseDown}
          style={{ touchAction: "none" }}
        >
          {/* Invisible wider hit area for easier clicking */}
          <div
            className="absolute inset-x-0 -top-1 -bottom-1 cursor-row-resize"
            onMouseDown={handleMouseDown}
          />
          {/* Visual indicator */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1 w-8 bg-gray-500 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
        </div>

        {/* Bottom Panel */}
        <div
          style={{ height: `${100 - topHeight}%` }}
          className="w-full overflow-hidden min-h-0"
        >
          {bottomPanel}
        </div>
      </div>
    </DragProvider>
  );
};
