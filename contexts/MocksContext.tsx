import React, { createContext, ReactNode, useContext, useState } from "react";

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

  return (
    <MocksContext.Provider value={{ useMocks, setUseMocks, toggleMocks }}>
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
