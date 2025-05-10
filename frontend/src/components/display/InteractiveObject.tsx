// src/components/InteractiveObject.tsx

/*────────────────────────────────────────────────────────────
  Component: InteractiveObject
  - Multiple clickable objects inside a Cell
  - Tracks hover & active state independently
  - Plays audio on click
───────────────────────────────────────────────────────────*/
import React, { useState } from 'react';
import { Box, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';

interface InteractiveObjectProps {
    id: string;
    audioSrc?: string;
    label?: React.ReactNode;
    onToggle?: (id: string, active: boolean) => void;
}

export function InteractiveObject({ id, audioSrc, label, onToggle }: InteractiveObjectProps) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();
    const [active, setActive] = useState(false);

    const handleClick = () => {
        const next = !active;
        setActive(next);
        onToggle?.(id, next);
        if (audioSrc) new Audio(audioSrc).play();
    };

    return (
        <Box
            ref={ref}
            onClick={handleClick}
            style={{
                padding: theme.spacing.sm,
                margin: theme.spacing.xs,
                backgroundColor: active
                    ? theme.colors.secondary[1]
                    : hovered
                        ? theme.colors.secondary[0]
                        : 'transparent',
                borderRadius: theme.radius.sm,
                border: `1px solid ${theme.colors.gray[4]}`,
                cursor: 'pointer',
                userSelect: 'none',
            }}
        >
            {label ?? id}
        </Box>
    );
}

