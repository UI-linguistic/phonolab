/**
 * Cell.tsx
 *
 * A highly‐configurable “Cell” component supporting:
 *
 * Variants (via `variant` prop):
 *  - default:       plain BaseCell box
 *  - frame:         centered content with extra padding
 *  - stack:         flex container stacking children (row|column) with adjustable `gap`
 *  - nested:        wraps an array of `items` into individual BaseCells laid out in a flex row/column
 *  - grid:          CSS Grid layout with configurable `columns` and `gap`
 *  - layout:        icon + precise inner frame + left/right gutters around your `children`
 *
 * Layout Props:
 *  - direction:     'row' | 'column'        (for stack & nested)
 *  - gap:           number (px)             (for stack, nested & grid)
 *  - columns:       number                  (for grid)
 *  - icon:          ReactNode               (for layout)
 *  - iconPosition:  'left' | 'right' | 'only' (for layout)
 *  - leftGutter:    number (px)             (for layout)
 *  - rightGutter:   number (px)             (for layout)
 *  - framePadX/Y:   number (px)             (inner red‐frame padding for layout)
 *
 * Interaction Props (apply to parent and to each nested item):
 *  - hoverable:        boolean (enables CSS :hover)
 *  - hovered:          boolean (force hover styles)
 *  - hoverBg:          string  (override hover background)
 *  - hoverBorderColor: string  (override hover border color)
 *  - onMouseEnter:     fn      (hover enter event)
 *  - onMouseLeave:     fn      (hover leave event)
 *  - activeable:       boolean (enables CSS :active)
 *  - active:           boolean (force active styles)
 *  - activeBg:         string  (override active background)
 *  - activeBorderColor:string  (override active border color)
 *  - onMouseDown:      fn      (active down event)
 *  - onMouseUp:        fn      (active up event)
 *
 * Drag & Drop Props (using @dnd-kit/core):
 *  - draggable:    boolean   (enable DnDKit on parent or nested item)
 *  - dragId:       string    (unique identifier, falls back to useId())
 *  - automatically applies `useDraggable` attributes, listeners, transform & opacity
 *
 * General:
 *  - `onClick` on parent cell
 *  - `children` rendered inside for default/frame/stack/grid/layout variants
 *  - `items: CellItem[]` for nested variant, each item supports its own hover/active/drag props
 *
 * Usage examples:
 *  <Cell>Default box</Cell>
 *  <Cell variant="frame">Centered</Cell>
 *  <Cell variant="stack" direction="row" gap={12}><A/><B/></Cell>
 *  <Cell variant="grid" columns={4} gap={16}><X/><Y/></Cell>
 *  <Cell variant="nested" items={[{id:'1',label:<A/>},…]} />
 *  <Cell variant="layout" icon={<Icon/>} iconPosition="left" framePadX={10} leftGutter={20}>Content</Cell>
 *  <Cell hoverable activeable draggable onClick={…}>Interactive</Cell>
 */



import React, { ComponentProps, useId } from 'react';
import styled, { css } from 'styled-components';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';


//
// 1) Extend BaseCell to support hover + active + drag styles
//
interface BaseCellStyleProps {
    /* Hover */
    hoverable?: boolean;              // enable :hover CSS
    hovered?: boolean;                // force hover styles
    hoverBg?: string;                 // override hover background
    hoverBorderColor?: string;        // override hover border‑color

    /* Active */
    activeable?: boolean;
    active?: boolean;
    activeBg?: string;
    activeBorderColor?: string;
}


const BaseCell = styled.div<BaseCellStyleProps>`
  background:rgba(240, 225, 214, 0);
  border: 2px solid #333;
  border-radius: 4px;
  padding: 8px;
  box-sizing: border-box;
  transition: background 150ms, border-color 150ms;

  ${({ hoverable, hoverBg, hoverBorderColor }) =>
        hoverable &&
        css`
      &:hover {
        background: ${hoverBg ?? '#e0d3c8'};
        border-color: ${hoverBorderColor ?? '#000'};
      }
    `}

  ${({ hovered, hoverBg, hoverBorderColor }) =>
        hovered &&
        css`
      background: ${hoverBg ?? '#e0d3c8'};
      border-color: ${hoverBorderColor ?? '#000'};
    `}

  ${({ activeable, activeBg, activeBorderColor }) =>
        activeable &&
        css`
      &:active {
        background: ${activeBg ?? '#d0c2b8'};
        border-color: ${activeBorderColor ?? '#111'};
      }
    `}

  ${({ active, activeBg, activeBorderColor }) =>
        active &&
        css`
      background: ${activeBg ?? '#d0c2b8'};
      border-color: ${activeBorderColor ?? '#111'};
    `}
`;


//
// 2) Other styled building‑blocks remain unchanged
//
const FrameCell = styled(BaseCell)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const StackCell = styled(FrameCell) <{ direction: 'row' | 'column'; gap: number }>`
  flex-direction: ${({ direction }) => direction};
  gap: ${({ gap }) => `${gap}px`};
`;

const GridCell = styled(FrameCell) <{ columns: number; gap: number }>`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  gap: ${({ gap }) => `${gap}px`};
`;

const InnerFrame = styled.div<{ padX: number; padY: number }>`
  border: 2px solid red;
  padding: ${({ padY, padX }) => `${padY}px ${padX}px`};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;


//
// 3) Types for unified Cell + nested items
//
export type CellVariant =
    | 'default'    // plain BaseCell
    | 'frame'      // FrameCell
    | 'stack'      // StackCell
    | 'nested'     // N array → N BaseCells
    | 'grid'       // GridCell
    | 'layout';    // icon + gutter + InnerFrame


export interface CellItem {
    id: string;
    label: React.ReactNode;

    /* hover per-item */
    hoverable?: boolean;
    hovered?: boolean;
    hoverBg?: string;
    hoverBorderColor?: string;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;

    /* active per-item */
    activeable?: boolean;
    active?: boolean;
    activeBg?: string;
    activeBorderColor?: string;
    onMouseDown?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;

    /* drag per-item */
    draggable?: boolean;
    dragId?: string;
}


export interface CellProps
    extends React.HTMLAttributes<HTMLDivElement> {
    /* variant */
    variant?: CellVariant;

    /* stack / nested */
    direction?: 'row' | 'column';
    gap?: number;

    /* grid */
    columns?: number;

    /* layout */
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right' | 'only';
    leftGutter?: number;
    rightGutter?: number;
    framePadX?: number;
    framePadY?: number;

    /* hover on parent */
    hoverable?: boolean;
    hovered?: boolean;
    hoverBg?: string;
    hoverBorderColor?: string;
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;

    /* active on parent */
    activeable?: boolean;
    active?: boolean;
    activeBg?: string;
    activeBorderColor?: string;
    onMouseDown?: React.MouseEventHandler;
    onMouseUp?: React.MouseEventHandler;

    /* drag on parent */
    draggable?: boolean;
    dragId?: string;

    /* content */
    children?: React.ReactNode;
    items?: CellItem[];

    /* click */
    onClick?: React.MouseEventHandler;
}



//
// 4) helper for draggable nested items
//
const DraggableItem: React.FC<CellItem> = ({
    id,
    dragId,
    label,
    hoverable,
    hovered,
    hoverBg,
    hoverBorderColor,
    onMouseEnter,
    onMouseLeave,
    activeable,
    active,
    activeBg,
    activeBorderColor,
    onMouseDown,
    onMouseUp,
}) => {
    // always call the hook, but we’ll only spread listeners when draggable===true
    const uniqueId = dragId || id;
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id: uniqueId });

    return (
        <BaseCell
            ref={setNodeRef}
            style={{
                transform: transform
                    ? CSS.Transform.toString(transform)
                    : undefined,
                opacity: isDragging ? 0.5 : 1,
            }}
            {...attributes}
            {...listeners}

            hoverable={hoverable}
            hovered={hovered}
            hoverBg={hoverBg}
            hoverBorderColor={hoverBorderColor}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}

            activeable={activeable}
            active={active}
            activeBg={activeBg}
            activeBorderColor={activeBorderColor}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
        >
            {label}
        </BaseCell>
    );
};


//
// 5) Prop Wrappers
//
type StackWrapperProps = Omit<ComponentProps<typeof StackCell>,
    'direction' | 'gap'
>;

export const StackWrapper: React.FC<StackWrapperProps & {
    direction: 'row' | 'column';
    gap: number;
}> = ({ direction, gap, ...props }) => (
    <StackCell {...props} direction={direction} gap={gap} />
);

type GridWrapperProps = Omit<
    ComponentProps<typeof GridCell>,
    'columns' | 'gap'
>;

export const GridWrapper: React.FC<GridWrapperProps & {
    columns: number;
    gap: number;
}> = ({ columns, gap, ...props }) => (
    <GridCell {...props} columns={columns} gap={gap} />
);


//
// 5) The unified Cell component
//
export const Cell: React.FC<CellProps> = ({
    variant = 'default',
    children,
    items = [],
    direction = 'column',
    gap = 8,
    columns = 3,
    icon,
    iconPosition = 'left',
    leftGutter = 16,
    rightGutter = 16,
    framePadX = 8,
    framePadY = 4,

    hoverable = false,
    hovered = false,
    hoverBg,
    hoverBorderColor,
    onMouseEnter,
    onMouseLeave,

    activeable = false,
    active = false,
    activeBg,
    activeBorderColor,
    onMouseDown,
    onMouseUp,

    draggable = false,
    dragId,

    onClick,
}) => {
    // 5a) Set up parent draggable hook once
    const fallbackId = useId();
    const parentId = dragId || fallbackId;
    const {
        attributes: dragAttributes,
        listeners: dragListeners,
        setNodeRef: dragRef,
        transform: dragTransform,
        isDragging: parentDragging,
    } = useDraggable({ id: parentId });

    // shared props for hover/active
    const shared = {
        hoverable,
        hovered,
        hoverBg,
        hoverBorderColor,
        onMouseEnter,
        onMouseLeave,

        activeable,
        active,
        activeBg,
        activeBorderColor,
        onMouseDown,
        onMouseUp,

        onClick,
    };

    // 5b) NESTED variant
    if (variant === 'nested') {
        return (
            <FrameCell
                ref={draggable ? dragRef : undefined}
                style={
                    draggable
                        ? {
                            transform: dragTransform
                                ? CSS.Transform.toString(dragTransform)
                                : undefined,
                            opacity: parentDragging ? 0.5 : 1,
                        }
                        : undefined
                }
                {...shared}
                {...(draggable ? { ...dragAttributes, ...dragListeners } : {})}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: direction,
                        gap: `${gap}px`,
                    }}
                >
                    {items.map(item =>
                        item.draggable ? (
                            <DraggableItem key={item.id} {...item} />
                        ) : (
                            <BaseCell key={item.id}
                                hoverable={item.hoverable}
                                hovered={item.hovered}
                                hoverBg={item.hoverBg}
                                hoverBorderColor={item.hoverBorderColor}
                                onMouseEnter={item.onMouseEnter}
                                onMouseLeave={item.onMouseLeave}
                                activeable={item.activeable}
                                active={item.active}
                                activeBg={item.activeBg}
                                activeBorderColor={item.activeBorderColor}
                                onMouseDown={item.onMouseDown}
                                onMouseUp={item.onMouseUp}
                            >
                                {item.label}
                            </BaseCell>
                        )
                    )}
                </div>
            </FrameCell>
        );
    }

    // 5c) LAYOUT variant
    if (variant === 'layout') {
        const showIcon = Boolean(icon) && iconPosition !== 'only';
        const showContent = iconPosition !== 'only';

        return (
            <FrameCell
                ref={draggable ? dragRef : undefined}
                style={
                    draggable
                        ? {
                            transform: dragTransform
                                ? CSS.Transform.toString(dragTransform)
                                : undefined,
                            opacity: parentDragging ? 0.5 : 1,
                        }
                        : undefined
                }
                {...shared}
                {...(draggable ? { ...dragAttributes, ...dragListeners } : {})}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {showIcon && iconPosition === 'left' && (
                        <div style={{ marginRight: leftGutter }}>{icon}</div>
                    )}
                    {showContent && (
                        <InnerFrame padX={framePadX} padY={framePadY}>
                            {children}
                        </InnerFrame>
                    )}
                    {showIcon && iconPosition === 'right' && (
                        <div style={{ marginLeft: rightGutter }}>{icon}</div>
                    )}
                </div>
            </FrameCell>
        );
    }

    // 5d) default / frame / stack / grid
    switch (variant) {
        case 'frame':
            return (
                <FrameCell
                    ref={draggable ? dragRef : undefined}
                    style={draggable ? {
                        transform: dragTransform
                            ? CSS.Transform.toString(dragTransform)
                            : undefined,
                        opacity: parentDragging ? 0.5 : 1,
                    } : undefined}
                    {...shared}
                    {...(draggable ? { ...dragAttributes, ...dragListeners } : {})}
                >
                    {children}
                </FrameCell>
            );

        case 'stack':
            return (
                <StackWrapper
                    direction={direction}
                    gap={gap}

                    /* drag + hover + active + click props */
                    ref={draggable ? dragRef : undefined}
                    style={draggable ? {
                        transform: dragTransform
                            ? CSS.Transform.toString(dragTransform)
                            : undefined,
                        opacity: parentDragging ? 0.5 : 1,
                    } : undefined}
                    {...shared}
                    {...(draggable ? { ...dragAttributes, ...dragListeners } : {})}
                >
                    {children}
                </StackWrapper>
            );

        case 'grid':
            return (
                <GridWrapper
                    columns={columns}
                    gap={gap}

                    /* drag + hover + active + click props */
                    ref={draggable ? dragRef : undefined}
                    style={draggable ? {
                        transform: dragTransform
                            ? CSS.Transform.toString(dragTransform)
                            : undefined,
                        opacity: parentDragging ? 0.5 : 1,
                    } : undefined}
                    {...shared}
                    {...(draggable ? { ...dragAttributes, ...dragListeners } : {})}
                >
                    {children}
                </GridWrapper>
            );

        default:
            // 'default'
            return (
                <BaseCell
                    ref={draggable ? dragRef : undefined}
                    style={draggable ? {
                        transform: dragTransform
                            ? CSS.Transform.toString(dragTransform)
                            : undefined,
                        opacity: parentDragging ? 0.5 : 1,
                    } : undefined}
                    {...shared}
                    {...(draggable ? { ...dragAttributes, ...dragListeners } : {})}
                >
                    {children}
                </BaseCell>
            );
    }
};
