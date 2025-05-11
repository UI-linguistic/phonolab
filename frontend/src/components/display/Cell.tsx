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

import { Paper, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import React, { ReactNode } from 'react';
import styles from './Cell.module.css';
import { Text, TextProps } from '@components/typography/PageTypography';

export interface CellProps {
    children: ReactNode;
    active?: boolean;
    onClick?: () => void;
    audioSrc?: string;
    sx?: React.CSSProperties; // override styles
    className?: string;    // override classes
    textProps?: Omit<TextProps, 'children'>;
}

export function Cell({
    children,
    active = false,
    onClick,
    audioSrc,
    sx,
    className,
    textProps,
}: CellProps) {
    const theme = useMantineTheme();
    const { hovered, ref } = useHover();

    const handleClick = () => {
        if (audioSrc) new Audio(audioSrc).play();
        onClick?.();
    };

    const cellClass = [
        styles.cell,
        active ? styles.cellActive : '',
        hovered ? styles.cellHover : '',
        className || '',
    ].join(' ');

    return (
        <Paper
            ref={ref}
            withBorder
            onClick={handleClick}
            className={cellClass}
            style={sx}
        >
            {textProps
                ? <Text {...textProps}>{children}</Text>
                : children}
        </Paper>
    );
}

export function MediaCell(props: CellProps) {
    return <Cell {...props} className={styles.mediaCell} />;
}