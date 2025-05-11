/**
 * ConfigurableGrid.tsx
 * 
 * A flexible grid component that you can customize for any content.
 * 
 * What Makes It Special:
 * • Works with any type of content
 * • Responsive layout (adjusts columns based on screen size)
 * • Supports drag-and-drop sorting
 * • Customizable spacing and gaps
 * 
 * Props You Can Use:
 * • items: Array of {id, content} objects
 * • cols: Number of columns (1-4)
 * • spacing: "sm" or "md" for gaps
 * • breakpoints: When to change layout
 * • mode: "static" or "sortable"
 * 
 * Usage Example:
 * ```tsx
 * const items = [
 *   { id: '1', content: <VowelCard /> },
 *   { id: '2', content: <VowelCard /> },
 *   { id: '3', content: <VowelCard /> }
 * ];
 * 
 * <ConfigurableGrid
 *   items={items}
 *   cols={3}
 *   spacing="md"
 *   mode="static"
 * />
 * ```
 */

// React and core dependencies
import React, { useState } from 'react';

// Mantine UI components
import { SimpleGrid, useMantineTheme } from '@mantine/core';

// DND Kit components
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Local components
import { Cell } from '@components/display/Cell';

/*────────────────────────────────────────────────────────────
  2. Types
───────────────────────────────────────────────────────────*/
export type GridMode = 'static' | 'sortable';

export interface GridItem {
  id: string;
  content: React.ReactNode;
  audioSrc?: string;
}

export interface ConfigurableGridProps {
  /*────────────────────────────────────────────────────────────
    3. Grid mode: 'static' or 'sortable'
  ────────────────────────────────────────────────────────────*/
  mode?: GridMode;

  /*────────────────────────────────────────────────────────────
    4. Data items for cells
  ────────────────────────────────────────────────────────────*/
  items: GridItem[];

  /*────────────────────────────────────────────────────────────
    5. Number of columns; rows adapt automatically
  ────────────────────────────────────────────────────────────*/
  cols?: number;

  /*────────────────────────────────────────────────────────────
    6. Gutter spacing
  ────────────────────────────────────────────────────────────*/
  spacing?: string | number;

  /*────────────────────────────────────────────────────────────
    7. Responsive breakpoints override (optional)
  ────────────────────────────────────────────────────────────*/
  breakpoints?: { maxWidth: string | number; cols: number }[];

  /*────────────────────────────────────────────────────────────
    8. Callback: new order after drag end (sortable mode)
  ────────────────────────────────────────────────────────────*/
  onOrderChange?: (items: GridItem[]) => void;

  /*────────────────────────────────────────────────────────────
    9. Callback: cell clicked (static mode)
       provides item, its flat index, and (row, col)
  ────────────────────────────────────────────────────────────*/
  onSelect?: (
    item: GridItem,
    index: number,
    row: number,
    col: number
  ) => void;
}

/*────────────────────────────────────────────────────────────
  10. Helper: SortableItem wrapper
───────────────────────────────────────────────────────────*/
function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: transform ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

/*────────────────────────────────────────────────────────────
  11. Main component
───────────────────────────────────────────────────────────*/
export function ConfigurableGrid({
  mode = 'static',
  items,
  cols = 4,
  spacing = 'sm',
  breakpoints,
  onOrderChange,
  onSelect,
}: ConfigurableGridProps) {
  const theme = useMantineTheme();
  const [internalItems, setInternalItems] = useState(items);
  const sensors = useSensors(useSensor(PointerSensor));

  /* default responsive breakpoints if none provided */
  const bp =
    breakpoints ?? [
      { maxWidth: theme.breakpoints.mobile, cols: Math.min(1, cols) },
      { maxWidth: theme.breakpoints.tablet, cols: Math.min(2, cols) },
      { maxWidth: theme.breakpoints.desktop, cols: Math.min(3, cols) },
    ];

  /* handle drag end */
  const handleDragEnd = (event: { active: any; over: any }) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = internalItems.findIndex((i) => i.id === active.id);
      const newIndex = internalItems.findIndex((i) => i.id === over.id);
      const newItems = arrayMove(internalItems, oldIndex, newIndex);
      setInternalItems(newItems);
      onOrderChange?.(newItems);
    }
  };

  /* static click handler */
  const handleClick = (item: GridItem, index: number) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    onSelect?.(item, index, row, col);
  };

  /* choose items array based on mode */
  const renderItems = mode === 'sortable' ? internalItems : items;

  /* render grid */
  if (mode === 'sortable') {
    /*────────────────────────────────────────────────────────
      12. Sortable Mode
    ─────────────────────────────────────────────────────────*/
    return (
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={renderItems.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: cols }} spacing={spacing}>
            {renderItems.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <Cell>{item.content}</Cell>
              </SortableItem>
            ))}
          </SimpleGrid>
        </SortableContext>
      </DndContext>
    );
  }

  /*────────────────────────────────────────────────────────
    13. Static Mode
  ─────────────────────────────────────────────────────────*/
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: cols }} spacing={spacing}>
      {renderItems.map((item, index) => (
        <div key={item.id} style={{ cursor: 'pointer' }} onClick={() => handleClick(item, index)}>
          <Cell>
            {item.content}
          </Cell>
        </div>
      ))}
    </SimpleGrid>
  );
}

/*────────────────────────────────────────────────────────────
  14. Usage Examples
───────────────────────────────────────────────────────────*/
/*
// 3×3 static grid:
<ConfigurableGrid
  mode="static"
  items={myData}
  cols={3}
  onSelect={(item, index, row, col) => console.log('clicked', item.id, row, col)}
/>

// single row draggable:
<ConfigurableGrid
  mode="sortable"
  items={myData}
  cols={myData.length}
  onOrderChange={(newItems) => console.log('new order', newItems)}
/>

// single column static:
<ConfigurableGrid
  mode="static"
  items={myData}
  cols={1}
  spacing="lg"
/>
*/
