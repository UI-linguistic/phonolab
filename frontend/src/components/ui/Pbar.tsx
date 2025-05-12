import React from 'react';
import { Group, Text, Progress, Box, useMantineTheme } from '@mantine/core';

interface QuizProgressBarProps {
    /** progress percent 0–100 */
    value: number;
    /** e.g. "1/3" */
    label?: string;
}

export function QuizProgressBar({
    value,
    label,
}: QuizProgressBarProps) {
    const theme = useMantineTheme();

    return (
        <Group align="center" gap="md" style={{ width: '100%', padding: '10px 0' }}>
            <Box style={{ flex: 1, position: 'relative' }}>
                <Progress
                    value={value}
                    color={theme.colors.primary[6]}
                    size="lg"
                    radius="xl"
                    striped
                    animated={value < 100}
                    styles={{
                        root: {
                            backgroundColor: theme.colors.gray[1],
                            border: `1px solid ${theme.colors.gray[3]}`,
                            boxShadow: theme.shadows.xs,
                        },
                        section: {
                            transition: 'width 300ms ease'
                        }
                    }}
                />
            </Box>
            {label && (
                <Box
                    style={{
                        backgroundColor: theme.colors.primary[6],
                        color: theme.white,
                        padding: '4px 12px',
                        borderRadius: theme.radius.sm,
                        fontWeight: 500,
                        minWidth: '60px',
                        textAlign: 'center',
                    }}
                >
                    {label}
                </Box>
            )}
        </Group>
    );
}
