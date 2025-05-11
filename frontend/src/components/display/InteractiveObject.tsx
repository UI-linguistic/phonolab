/**
 * InteractiveObject.tsx
 * 
 * A clickable object that plays audio when clicked.
 * 
 * What It Does:
 * • Shows a label (like "æ" or "ɪ")
 * • Plays audio when clicked
 * • Has a nice hover effect
 * • Works with multiple audio sources
 * 
 * Props You Can Use:
 * • id: Unique identifier
 * • label: Text to display
 * • audioUrls: Array of audio URLs to try
 * 
 * Usage Example:
 * ```tsx
 * <InteractiveObject
 *   id="vowel-1"
 *   label="æ"
 *   audioUrls={[
 *     "/audio/ae.mp3",
 *     "/audio/ae-fallback.mp3"
 *   ]}
 * />
 * ```
 */

// React and core dependencies
import React, { useState } from 'react';

// Mantine UI components and hooks
import { Box, useMantineTheme, Text } from '@mantine/core';
import { useHover } from '@mantine/hooks';

interface InteractiveObjectProps {
    id: string;
    label?: React.ReactNode;
    audioUrls?: string[];
    onToggle?: (id: string, active: boolean) => void;
    textProps?: any;
}

export function InteractiveObject({
    id,
    label,
    audioUrls = [],
    onToggle,
    textProps,
}: InteractiveObjectProps) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [active, setActive] = useState(false);

    const handleClick = () => {
        const next = !active;
        setActive(next);
        onToggle?.(id, next);

        // try each URL until one plays
        for (const url of audioUrls) {
            try {
                new Audio(url).play();
                break;
            } catch {
                // swallow and try next
            }
        }
    };

    return (
        <Box
            ref={ref}
            onClick={handleClick}
            style={{
                padding: theme.spacing.xs,
                backgroundColor: active
                    ? theme.colors.secondary[1]
                    : hovered
                        ? theme.colors.secondary[0]
                        : 'transparent',
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.colors.gray[4]}`,
                cursor: 'pointer',
                userSelect: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text {...textProps}>{label}</Text>
        </Box>
    );
}
