import React from 'react';
import { Group, Text, Progress, Box, useMantineTheme } from '@mantine/core';

interface QuizProgressBarProps {
    /** progress percent 0–100 */
    value: number;
    /** e.g. "1/3" */
    label?: string;
    /** Whether to show label on the right side */
    labelOnRight?: boolean;
}

export function QuizProgressBar({
    value,
    label,
    labelOnRight = true, // Default to placing label on right
}: QuizProgressBarProps) {
    const theme = useMantineTheme();

    // Ensure value is valid and always visible (minimum 33.33% for "1/3")
    const displayValue = value > 0 ? value : 33.33;

    // Create a wrapper component that places the label on the right
    // with the progress bar taking up the available space
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            position: 'relative'
        }}>
            {/* Progress bar container */}
            <div style={{
                flex: '1 1 auto',
                position: 'relative',
                backgroundColor: 'transparent',
                borderRadius: '999px',
                border: '1px solid #333',
                height: '16px',
                overflow: 'hidden'
            }}>
                {/* Filled portion */}
                <div style={{
                    width: `${displayValue}%`,
                    height: '100%',
                    backgroundColor: 'black',
                    borderRadius: '999px 0 0 999px',
                }} />
            </div>

            {/* Label positioned to the right with some margin */}
            {label && (
                <div style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    marginLeft: '14px',
                    fontWeight: 600,
                    minWidth: '40px',
                    textAlign: 'center',
                    fontSize: '18px',
                    whiteSpace: 'nowrap',
                    border: `2.1px solid ${theme.black}`,
                }}>
                    {label}
                </div>
            )}
        </div>
    );
}
