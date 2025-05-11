/**
 * Layouts.tsx
 * 
 * Common layout patterns for the app.
 * 
 * What's Inside:
 * • TwoCol: Two-column layout that stacks on mobile
 * • BackRow: Row with back button and optional title
 * • ButtonList: Vertical list of buttons
 * • CircleWrapper: Fixed-size circle for illustrations
 * 
 * Usage Example:
 * ```tsx
 * // Two columns
 * <TwoCol>
 *   <div>Left side</div>
 *   <div>Right side</div>
 * </TwoCol>
 * 
 * // Back button row
 * <BackRow>
 *   <BackButton />
 *   <h1>Page Title</h1>
 * </BackRow>
 * 
 * // Button list
 * <ButtonList>
 *   <Button>Option 1</Button>
 *   <Button>Option 2</Button>
 * </ButtonList>
 * ```
 */

// React and core dependencies
import React from 'react';

// Mantine UI components
import { SimpleGrid, Group, Stack } from '@mantine/core';

// Local components
import { Cell } from '@components/display/Cell';

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
