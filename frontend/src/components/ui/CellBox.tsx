/**
 * CellBoxComponents.tsx
 *
 * Replaces legacy `Cell`/`Collection` system using Mantine-only components.
 * Provides reusable UI building blocks for Learn/Quiz interactions.
 */

import React from 'react';
import {
    Box,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    Image,
    Flex,
    MantineTheme,
} from '@mantine/core';

// ------------------------------
// Base Interactive Cell Box
// ------------------------------

interface CellBoxProps {
    children: React.ReactNode;
    minHeight?: number;
    padding?: string;
    centered?: boolean;
    onClick?: () => void;
}

export const CellBox: React.FC<CellBoxProps> = ({
    children,
    minHeight = 64,
    padding = 'md',
    centered = true,
    onClick,
}) => (
    <Paper
        withBorder
        p={padding}
        radius="md"
        onClick={onClick}
        styles={(theme: MantineTheme) => ({
            root: {
                minHeight,
                display: 'flex',
                justifyContent: centered ? 'center' : 'flex-start',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 100ms ease, background 100ms ease',
                '&:hover': {
                    backgroundColor: theme.colors.gray[1],
                },
                '&:active': {
                    transform: 'scale(0.97)',
                },
            },
        })}
    >
        {children}
    </Paper>
);

// ------------------------------
// Grid Variants
// ------------------------------

export const MatrixCellGrid = ({ items }: { items: React.ReactNode[] }) => (
    <SimpleGrid cols={3} spacing="sm">
        {items.map((child, i) => (
            <CellBox key={i}>{child}</CellBox>
        ))}
    </SimpleGrid>
);

export const SmallGrid = ({ items }: { items: React.ReactNode[] }) => (
    <SimpleGrid cols={3} spacing="xs">
        {items.map((child, i) => (
            <CellBox key={i} minHeight={40} padding="xs">{child}</CellBox>
        ))}
    </SimpleGrid>
);

// ------------------------------
// Stack of 5 cells
// ------------------------------

export const VerticalStackCells = ({ items }: { items: React.ReactNode[] }) => (
    <Stack gap="sm">
        {items.map((child, i) => (
            <CellBox key={i}>{child}</CellBox>
        ))}
    </Stack>
);

// ------------------------------
// Media & Text displays
// ------------------------------

export const ImageFrame = ({ src, alt = '', fit = 'contain' }: { src: string; alt?: string; fit?: 'contain' | 'cover' }) => (
    <Paper withBorder p="md" radius="md">
        <Image src={src} alt={alt} fit={fit} radius="md" />
    </Paper>
);

export const InstructionBox = ({ children }: { children: React.ReactNode }) => (
    <Paper withBorder p="md" radius="md">
        <Text ta="center" size="md">
            {children}
        </Text>
    </Paper>
);

// ------------------------------
// Combo Layout Example
// ------------------------------

export const LabeledIconRow = ({ icon, label }: { icon: React.ReactNode; label: React.ReactNode }) => (
    <Flex align="center" gap="sm">
        {icon}
        <Text>{label}</Text>
    </Flex>
);

// ------------------------------
// Export Wrapper
// ------------------------------

export default {
    CellBox,
    MatrixCellGrid,
    SmallGrid,
    VerticalStackCells,
    ImageFrame,
    InstructionBox,
    LabeledIconRow,
};
