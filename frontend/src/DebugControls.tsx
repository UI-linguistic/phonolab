import React from 'react';
import styled from 'styled-components';
import { Switch, Text, Group, Stack, Select } from '@mantine/core';

const DebugControlsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  z-index: 10000;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
`;

const DebugTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 5px;
`;

// Styled component for the control row with proper spacing
const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

interface DebugControlsProps {
    debugSettings: {
        enabled: boolean;
        labelPosition: string;
        labelsEnabled: boolean;
    };
    setDebugSettings: React.Dispatch<React.SetStateAction<{
        enabled: boolean;
        labelPosition: string;
        labelsEnabled: boolean;
    }>>;
}

export default function DebugControls({ debugSettings, setDebugSettings }: DebugControlsProps) {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <DebugControlsContainer>
            <DebugTitle>Layout Debug Controls</DebugTitle>
            <Stack gap="xs">
                <ControlRow>
                    <Text size="sm">Debug Outlines</Text>
                    <Switch
                        checked={debugSettings.enabled}
                        onChange={(event) => setDebugSettings(prev => ({
                            ...prev,
                            enabled: event.currentTarget.checked
                        }))}
                        size="sm"
                    />
                </ControlRow>

                <ControlRow>
                    <Text size="sm">Debug Labels</Text>
                    <Switch
                        checked={debugSettings.labelsEnabled}
                        onChange={(event) => setDebugSettings(prev => ({
                            ...prev,
                            labelsEnabled: event.currentTarget.checked
                        }))}
                        size="sm"
                        disabled={!debugSettings.enabled}
                    />
                </ControlRow>

                <Select
                    label="Label Position"
                    size="xs"
                    value={debugSettings.labelPosition}
                    onChange={(value) => setDebugSettings(prev => ({
                        ...prev,
                        labelPosition: value || 'top-left'
                    }))}
                    data={[
                        { value: 'top-left', label: 'Top Left' },
                        { value: 'top-right', label: 'Top Right' },
                        { value: 'bottom-left', label: 'Bottom Left' },
                        { value: 'bottom-right', label: 'Bottom Right' },
                    ]}
                    disabled={!debugSettings.enabled || !debugSettings.labelsEnabled}
                />
            </Stack>
        </DebugControlsContainer>
    );
}
