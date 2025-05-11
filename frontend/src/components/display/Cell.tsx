/**
 * Cell.tsx
 * 
 * A single cell in a grid that can show any content.
 * 
 * What It Does:
 * • Shows content in a square cell
 * • Can be active or inactive
 * • Works in both learn and quiz modes
 * • Handles hover states
 * 
 * Props You Can Use:
 * • children: Content to show inside
 * • active: Whether cell is active
 * • draggable: Whether cell can be dragged
 * • gridHover: Whether grid is being hovered
 * 
 * Usage Example:
 * ```tsx
 * <Cell
 *   active={true}
 *   draggable={false}
 *   gridHover={false}
 * >
 *   <VowelCard />
 * </Cell>
 * ```
 */

import { Paper, useMantineTheme, MantineTheme, useMantineColorScheme } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { useHover } from '@mantine/hooks';
import React, { ReactNode } from 'react';



const useStyles = createStyles((theme: MantineTheme, { active, colorScheme }: { active: boolean; colorScheme: 'light' | 'dark' | 'auto' }) => ({
    cell: {
        padding: theme.spacing.md,
        border: `2px solid ${active ? theme.colors.primary[6] : theme.colors.gray[4]}`,
        borderRadius: theme.radius.sm,
        backgroundColor: active
            ? theme.colors.primary[0]
            : colorScheme === 'dark' || colorScheme === 'auto'
                ? theme.colors.dark[6]
                : theme.white,
        transition: 'background 150ms, border-color 150ms',
        '&:hover': {
            backgroundColor: theme.colors.gray[0],
        },
        cursor: 'pointer',
        userSelect: 'none',
    },
}));

export interface CellProps {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
    audioSrc?: string;
    sx?: any;              // override styles
    className?: string;    // override classes
}

export function Cell({
    children,
    active = false,
    onClick,
    audioSrc,
    sx,
    className,
}: CellProps) {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const { classes, cx } = useStyles({ active, colorScheme });
    const { ref } = useHover();

    const handleClick = () => {
        if (audioSrc) new Audio(audioSrc).play();
        onClick?.();
    };

    return (
        <Paper
            ref={ref}
            withBorder
            onClick={handleClick}
            className={cx(classes.cell, className)}
            styles={{ root: sx }}
        >
            {children}
        </Paper>
    );
}
