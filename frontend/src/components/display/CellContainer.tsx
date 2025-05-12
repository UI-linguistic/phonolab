/**
 * CellContainer.tsx
 * 
 * A flexible container that can hold multiple Cell components in different layouts.
 * 
 * What It Does:
 * • Acts as a wrapper for multiple Cell components
 * • Supports different layout modes: row, column, or grid
 * • Customizable spacing between cells
 * • Can be used within the Cell component for nested layouts
 * 
 * Props You Can Use:
 * • children: Content to show inside (usually Cell components)
 * • layout: 'row' | 'column' | 'grid' - how to arrange children
 * • cols: Number of columns when layout is 'grid'
 * • spacing: Spacing between cells
 * 
 * Usage Example:
 * ```tsx
 * // Row layout
 * <CellContainer layout="row" spacing="sm">
 *   <Cell>Cell 1</Cell>
 *   <Cell>Cell 2</Cell>
 * </CellContainer>
 * 
 * // Grid layout
 * <CellContainer layout="grid" cols={2} spacing="md">
 *   <Cell>Cell 1</Cell>
 *   <Cell>Cell 2</Cell>
 *   <Cell>Cell 3</Cell>
 *   <Cell>Cell 4</Cell>
 * </CellContainer>
 * ```
 */

import React, { ReactNode } from 'react';
import { Box, SimpleGrid, Flex } from '@mantine/core';
import { Cell, CellProps } from './Cell';

export type CellContainerLayout = 'row' | 'column' | 'grid';

export interface CellContainerProps {
    children: ReactNode;
    layout: CellContainerLayout;
    cols?: number;
    spacing?: 'xs' | 'sm' | 'md' | 'lg' | string | number;
    className?: string;
    style?: React.CSSProperties;
}

export function CellContainer({
    children,
    layout = 'grid',
    cols = 2,
    spacing = 'sm',
    className,
    style,
}: CellContainerProps) {
    // Convert string spacing to pixel values
    const spacingValue = typeof spacing === 'string'
        ? spacing === 'xs' ? '0.5rem'
            : spacing === 'sm' ? '0.75rem'
                : spacing === 'md' ? '1rem'
                    : spacing === 'lg' ? '1.5rem'
                        : spacing
        : spacing;

    if (layout === 'row') {
        return (
            <Flex
                gap={spacingValue}
                direction="row"
                wrap="nowrap"
                className={className}
                style={style}
            >
                {children}
            </Flex>
        );
    }

    if (layout === 'column') {
        return (
            <Flex
                gap={spacingValue}
                direction="column"
                className={className}
                style={style}
            >
                {children}
            </Flex>
        );
    }

    // Default is grid layout
    return (
        <SimpleGrid
            cols={cols}
            spacing={spacingValue}
            className={className}
            style={style}
        >
            {children}
        </SimpleGrid>
    );
}

// Helper component to wrap content in a Cell
export function CellItem({
    children,
    ...cellProps
}: CellProps) {
    return (
        <Cell {...cellProps}>
            {children}
        </Cell>
    );
} 