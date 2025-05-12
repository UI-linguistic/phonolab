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

        // Try each URL until one plays successfully
        let played = false;
        for (const url of audioUrls) {
            if (!url) continue;
            try {
                console.log(`Attempting to play audio: ${url}`);
                const audioEl = new Audio(url);

                // Add error handlers to detect issues
                audioEl.onerror = (e) => {
                    console.error(`Error playing audio for ${url}:`, e);
                };

                // Try to play and catch any errors
                audioEl.play()
                    .then(() => {
                        console.log(`Successfully playing: ${url}`);
                        played = true;
                    })
                    .catch(e => {
                        console.error(`Failed to play ${url}:`, e.message);
                        // Continue to next URL only if we haven't played anything yet
                        if (!played && audioUrls.indexOf(url) < audioUrls.length - 1) {
                            console.log(`Trying next fallback audio URL...`);
                        }
                    });

                break;
            } catch (e) {
                console.error(`Exception trying to create Audio for ${url}:`, e);
                // continue to next URL
            }
        }
    };

    return (
        <Box
            ref={ref}
            onClick={handleClick}
            style={{
                padding: `${theme.spacing.xs}px ${theme.spacing.xs}px`,
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
                width: 'fit-content',
                minWidth: '2rem',
                minHeight: '2rem',
                margin: '0.25rem',
            }}
        >
            <Text {...textProps}>{label}</Text>
        </Box>
    );
}
