/**
 * Collection.tsx
 *
 * A generic container for rendering a list of items in flexible layouts:
 *
 * Features:
 *  - Three layout modes via `layout` prop:
 *      • column: vertical stack with optional equal‑height children (`flexFill`)
 *      • row:    horizontal stack
 *      • grid:   CSS grid with configurable `columns`
 *  - Automatic application of CellProps on every child via `itemCellProps`
 *      (e.g. hoverable, draggable, onClick, style overrides)
 *  - No assumptions about item content—`renderItem` can return any ReactNode
 *  - Keys and wrapper logic handled internally for both elements and primitives
 *
 * Props:
 *  • items:           T[]                       — array of data items
 *  • layout:          CollectionLayout         — choose column/row/grid + gaps
 *  • renderItem:      (item, index) ⇒ ReactNode — render each item’s UI
 *  • style:           CSSProperties             — extra wrapper styles
 *  • itemCellProps:   Partial<CellProps>        — props to graft onto every cell
 *
 * Usage example:
 *  <Collection
 *    items={myData}
 *    layout={{ type: 'column', gap: 12, flexFill: true }}
 *    renderItem={(d, i) => <PhonemeBox key={d.id} label={d.symbol} />}
 *    itemCellProps={{ draggable: true }}
 *    style={{ height: '100%' }}
 *  />
 */

import React from 'react';
import { StackWrapper, GridWrapper } from './Cell';
import type { CellProps } from './Cell';


export type CollectionLayout =
    | { type: 'column'; gap?: number; flexFill?: boolean }
    | { type: 'row'; gap?: number }
    | { type: 'grid'; gap?: number; columns?: number };


export interface CollectionProps<T> {
    items: T[];
    layout: CollectionLayout;

    /** Can return any ReactNode (string, element, fragment, etc.) */
    renderItem: (item: T, index: number) => React.ReactNode;

    style?: React.CSSProperties;

    /** Props to merge into each rendered Cell-based component */
    itemCellProps?: Partial<CellProps>;
}

export function Collection<T>({
    items,
    layout,
    renderItem,
    style,
    itemCellProps = {},
}: CollectionProps<T>) {
    // Wrap any node so we can merge in cell props
    const wrap = (node: React.ReactNode, key: React.Key) => {
        if (React.isValidElement(node)) {
            return React.cloneElement(node, { key, ...itemCellProps, ...node.props });
        }
        // primitive or fragment → wrap in div
        return (
            <div key={key} {...itemCellProps}>
                {node}
            </div>
        );
    };

    // COLUMN
    if (layout.type === 'column') {
        return (
            <StackWrapper
                direction="column"
                gap={layout.gap ?? 8}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    ...style,
                }}
            >
                {items.map((item, i) => {
                    const node = renderItem(item, i);
                    const element = wrap(
                        layout.flexFill
                            ? <div style={{ flex: 1, display: 'flex' }}>{node}</div>
                            : node,
                        i
                    );
                    return element;
                })}
            </StackWrapper>
        );
    }

    // ROW
    if (layout.type === 'row') {
        return (
            <StackWrapper
                direction="row"
                gap={layout.gap ?? 8}
                style={{ display: 'flex', ...style }}
            >
                {items.map((item, i) => wrap(renderItem(item, i), i))}
            </StackWrapper>
        );
    }

    // GRID
    return (
        <GridWrapper
            columns={layout.columns ?? 3}
            gap={layout.gap ?? 8}
            style={{ display: 'grid', width: '100%', ...style }}
        >
            {items.map((item, i) => wrap(renderItem(item, i), i))}
        </GridWrapper>
    );
}
