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
 * • Can contain any content, including other cells in a CellContainer
 * 
 * Props You Can Use:
 * • children: Content to show inside (can be text, components, or even CellContainer)
 * • active: Whether cell is active
 * • onClick: Function to call when cell is clicked
 * • audioSrc: Audio file to play when cell is clicked
 * • sx: Custom CSS styles
 * • className: Custom CSS class
 * • textProps: Props to pass to Text component if children are text
 * 
 * Usage Example:
 * ```tsx
 * // Simple cell with text
 * <Cell>Simple text</Cell>
 * 
 * // Cell with nested cells in a row layout
 * <Cell>
 *   <CellContainer layout="row" spacing="sm">
 *     <Cell>Nested Cell 1</Cell>
 *     <Cell>Nested Cell 2</Cell>
 *   </CellContainer>
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