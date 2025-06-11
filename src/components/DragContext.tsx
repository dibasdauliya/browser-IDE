import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";

interface DragContextType {
  isDragging: boolean;
}

const DragContext = createContext<DragContextType>({ isDragging: false });

export const useDragContext = () => useContext(DragContext);

interface DragProviderProps {
  isDragging: boolean;
  children: ReactNode;
}

export const DragProvider: React.FC<DragProviderProps> = ({
  isDragging,
  children,
}) => {
  return (
    <DragContext.Provider value={{ isDragging }}>
      {children}
    </DragContext.Provider>
  );
};
