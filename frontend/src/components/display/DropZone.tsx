/**
 * DropZone.tsx
 * 
 * A special area where you can drop draggable items.
 * 
 * What It Does:
 * • Shows a drop target area
 * • Changes style when you drag over it
 * • Handles drop events
 * • Works with drag-and-drop sorting
 * 
 * Props You Can Use:
 * • id: Unique identifier
 * • onDrop: Function to run when item is dropped
 * • isOver: Whether something is being dragged over
 * 
 * Usage Example:
 * ```tsx
 * <DropZone
 *   id="drop-1"
 *   onDrop={(item) => console.log('Dropped:', item)}
 *   isOver={false}
 * />
 * ```
 */

// React and core dependencies
import React from 'react';

// DND Kit components
import { useDroppable } from '@dnd-kit/core';

// Mantine UI components
import { Box } from '@mantine/core';

/*────────────────────────────────────────────────────────────
  Component: DropZone
  - Defines a droppable area for draggable grids
───────────────────────────────────────────────────────────*/

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
