// src/components/Layouts.tsx
import React from 'react';
import { SimpleGrid, Group, Stack } from '@mantine/core';
import { Cell } from './Cell';

export function GridLayout() {
    return (
        <SimpleGrid cols={4} spacing="sm">
            {Array.from({ length: 12 }).map((_, i) => (
                <Cell key={i}>{String.fromCharCode(65 + i)}</Cell>
            ))}
        </SimpleGrid>
    );
}

export function RowLayout() {
    return (
        <Group gap="xs" wrap="nowrap">
            {[1, 2, 3, 4, 5].map((n) => (
                <Cell key={n}>Item {n}</Cell>
            ))}
        </Group>
    );
}

export function ColumnLayout() {
    return (
        <Stack gap="sm">
            {['A', 'B', 'C', 'D'].map((v) => (
                <Cell key={v}>{v}</Cell>
            ))}
        </Stack>
    );
}
