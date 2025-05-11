import React, { createContext, useContext, useState } from 'react';
import { useTheme } from 'styled-components';

type DebugContextType = {
    debugOutline: boolean;
    setDebugOutline: (v: boolean) => void;
};

const DebugContext = createContext<DebugContextType>({
    debugOutline: false,
    setDebugOutline: () => { },
});

export const useDebug = () => useContext(DebugContext);

export const DebugProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [debugOutline, setDebugOutline] = useState(false);
    return (
        <DebugContext.Provider value={{ debugOutline, setDebugOutline }}>
            {children}
        </DebugContext.Provider>
    );
};

const OutlineTest = () => {
    const theme = useTheme();
    return (
        <div
            style={{
                outline: theme.debugOutline ? '2px solid red' : 'none',
                margin: 20,
                padding: 20,
            }}
        >
            OutlineTest: debugOutline = {String(theme.debugOutline)}
        </div>
    );
};

// Render <OutlineTest /> somewhere in your app