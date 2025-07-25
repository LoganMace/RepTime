import React, { createContext, useContext, useMemo } from "react";
import { useWindowDimensions } from "react-native";

export type Orientation = "portrait" | "landscape";

const OrientationContext = createContext<Orientation>("portrait");

export const OrientationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { width, height } = useWindowDimensions();
  const orientation: Orientation = width > height ? "landscape" : "portrait";

  // Memoize to avoid unnecessary re-renders
  const value = useMemo(() => orientation, [orientation]);

  return (
    <OrientationContext.Provider value={value}>
      {children}
    </OrientationContext.Provider>
  );
};

export const useOrientation = () => useContext(OrientationContext);
