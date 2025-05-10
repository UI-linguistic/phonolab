// src/components/DropZone.tsx

/*────────────────────────────────────────────────────────────
  Component: DropZone
  - Defines a droppable area for draggable grids
───────────────────────────────────────────────────────────*/
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mantine/core';

interface DropZoneProps {
    id: string;
    children?: React.ReactNode;
}

export function DropZone({ id, children }: DropZoneProps) {
    const { isOver, setNodeRef } = useDroppable({ id });
    return (
        <Box
            ref={setNodeRef}
            style={(theme) => ({
                minHeight: 120,
                padding: theme.spacing.md,
                border: `2px dashed ${isOver ? theme.colors.primary[6] : theme.colors.gray[4]}`,
                borderRadius: theme.radius.sm,
                backgroundColor: isOver ? theme.colors.primary[0] : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            })}
        >
            {children}
        </Box>
    );
}
