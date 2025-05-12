import React, { createContext, useContext, useState } from 'react';
import { Container, Title, Text, Paper, Group, Button, Code } from '@mantine/core';

const DevToolsPage = () => {
    const [themeInfo, setThemeInfo] = useState(false);

    return (
        <Container size="lg" py={40}>
            <Title order={1} mb={20}>Developer Tools</Title>

            <Paper p="md" withBorder mb={20}>
                <Title order={3} mb={10}>Environment Information</Title>
                <Text>Node Environment: <Code>{process.env.NODE_ENV}</Code></Text>
                <Text>React Version: <Code>{React.version}</Code></Text>
                <Text>Build Time: <Code>{new Date().toLocaleString()}</Code></Text>
            </Paper>

            <Paper p="md" withBorder mb={20}>
                <Title order={3} mb={10}>Theme Explorer</Title>
                <Button onClick={() => setThemeInfo(!themeInfo)}>
                    {themeInfo ? 'Hide Theme Info' : 'Show Theme Info'}
                </Button>

                {themeInfo && (
                    <Code block mt={15} style={{ maxHeight: '400px', overflow: 'auto' }}>
                        {JSON.stringify(window.getComputedStyle(document.documentElement), null, 2)}
                    </Code>
                )}
            </Paper>

            <Group justify="center" mt={30}>
                <Button color="red" variant="outline">Clear Local Storage</Button>
                <Button color="orange" variant="outline">Reset App State</Button>
                <Button color="green">Run Tests</Button>
            </Group>
        </Container>
    );
};

export default DevToolsPage;


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
    const [debugOutline, setDebugOutline] = useState(true);
    return (
        <DebugContext.Provider value={{ debugOutline, setDebugOutline }}>
            {children}
        </DebugContext.Provider>
    );
};


// Render <OutlineTest /> somewhere in your app