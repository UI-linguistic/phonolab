// Collection.tsx
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
    renderItem: (item: T, index: number) => React.ReactElement;
    style?: React.CSSProperties;

    /** props to merge into every rendered Cell‑based component */
    itemCellProps?: Partial<CellProps>;
}

export function Collection<T>({
    items,
    layout,
    renderItem,
    style,
    itemCellProps = {},
}: CollectionProps<T>) {
    const applyProps = (el: React.ReactElement) =>
        React.cloneElement(el, { ...itemCellProps, ...el.props });

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
                    const child = renderItem(item, i);
                    const withProps = applyProps(
                        layout.flexFill
                            ? React.cloneElement(child, {
                                style: { flex: 1, display: 'flex', ...(child.props.style || {}) },
                            })
                            : child
                    );
                    return React.cloneElement(withProps, { key: child.key ?? i });
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
                {items.map((item, i) => {
                    const child = renderItem(item, i);
                    return React.cloneElement(applyProps(child), { key: child.key ?? i });
                })}
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
            {items.map((item, i) => {
                const child = renderItem(item, i);
                return React.cloneElement(applyProps(child), { key: child.key ?? i });
            })}
        </GridWrapper>
    );
}
