import React from 'react';
import { Group, Box, Progress, useMantineTheme, MantineTheme } from '@mantine/core';

interface QuizProgressBarProps {
    /** progress percent 0–100 */
    value: number;
    /** e.g. "1/3" */
    label?: string;
    /** pick one of your defined spacing sizes (xs, sm, md, lg, xl) */
    sizeKey?: keyof MantineTheme['spacing'];
}

export function QuizProgressBar({
    value,
    label,
    sizeKey = 'sm',
}: QuizProgressBarProps) {
    const theme = useMantineTheme();

    // colorShade 6 is a nice middle tone in your 10‑shade arrays
    const borderColor = theme.colors.primary[6];
    const barColor = theme.colors.primary[6];
    const bgColor = theme.colors.background[0];

    return (
        <Group align="center" gap="md" style={{ width: '100%' }}>
            <Box style={{ flex: 1, minWidth: 120 }}>
                <Progress
                    value={value}
                    size={theme.spacing[sizeKey]}   // use your spacing token as the thickness
                    radius={theme.radius.sm}        // consistent corner radius
                    color="primary"
                    styles={(t: MantineTheme) => ({
                        root: {
                            backgroundColor: bgColor,
                            border: `2px solid ${borderColor}`,
                            borderRadius: t.radius.sm,
                            overflow: 'hidden',
                        },
                        bar: {
                            backgroundColor: barColor,
                            height: '100%',
                        },
                    })}
                />
            </Box>
            {label && (
                <Box
                    style={(t: MantineTheme) => ({
                        display: 'inline-block',
                        textAlign: 'center' as const,
                        minWidth: 40,
                        padding: `${t.spacing.xs} ${t.spacing.sm}`,
                        fontFamily: t.fontFamily,
                        fontSize: t.fontSizes.md,
                        border: `2px solid ${borderColor}`,
                        borderRadius: t.radius.xs,
                        backgroundColor: bgColor,
                    })}
                >
                    {label}
                </Box>
            )}
        </Group>
    );
}
