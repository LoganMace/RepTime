import React, { createContext, ReactNode, useContext, useState, useMemo } from "react";

interface MocksContextType {
  useMocks: boolean;
  setUseMocks: (value: boolean) => void;
  toggleMocks: () => void;
}

const MocksContext = createContext<MocksContextType | undefined>(undefined);

interface MocksProviderProps {
  children: ReactNode;
  defaultUseMocks?: boolean;
}

export function MocksProvider({
  children,
  defaultUseMocks = true,
}: MocksProviderProps) {
  const [useMocks, setUseMocks] = useState(defaultUseMocks);

  const toggleMocks = () => {
    setUseMocks((prev) => !prev);
  };

  const contextValue = useMemo(() => ({
    useMocks,
    setUseMocks,
    toggleMocks,
  }), [useMocks]);

  return (
    <MocksContext.Provider value={contextValue}>
      {children}
    </MocksContext.Provider>
  );
}

export function useMocksContext() {
  const context = useContext(MocksContext);
  if (context === undefined) {
    throw new Error("useMocksContext must be used within a MocksProvider");
  }
  return context;
}
