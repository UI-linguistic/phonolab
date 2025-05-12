import React, { useState, useEffect } from 'react';
import { Box, Button, ColorInput, NumberInput, Group, Paper, Stack, ActionIcon, Tooltip } from '@mantine/core';

// Remove the tabler icons import as we'll use a simpler approach for now
// and create a simple plus icon component
const PlusIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

type Position = {
    x: number;
    y: number;
    width: number;
    height: number;
};

interface ItemStyle {
    backgroundColor?: string;
    borderColor?: string;
    borderSize?: number;
}

interface DraggableItem {
    id: string;
    position: Position;
    content: React.ReactNode;
    resizable?: boolean;
    style?: ItemStyle;
}

interface DraggablePositionerProps {
    items: DraggableItem[];
    editable?: boolean;
    containerHeight?: number;
    onPositionsChange?: (positions: Record<string, Position>) => void;
    onItemsChange?: (items: DraggableItem[]) => void;
    savedPositions?: Record<string, Position>;
    savedStyles?: Record<string, ItemStyle>;
    onAddItem?: (itemType: string) => void;
}

// Resize handle positions
type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'right' | 'bottom' | null;

export function DraggablePositioner({
    items,
    editable = false,
    containerHeight = 600,
    onPositionsChange,
    onItemsChange,
    savedPositions = {},
    savedStyles = {},
    onAddItem,
}: DraggablePositionerProps) {
    // Track positions of all items
    const [positions, setPositions] = useState<Record<string, Position>>({});
    const [itemStyles, setItemStyles] = useState<Record<string, ItemStyle>>({});
    const [dragging, setDragging] = useState<string | null>(null);
    const [resizing, setResizing] = useState<{ id: string, handle: ResizeHandle } | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [editMode, setEditMode] = useState(editable);
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    // Initialize positions from items or saved positions
    useEffect(() => {
        const initialPositions: Record<string, Position> = {};
        const initialStyles: Record<string, ItemStyle> = {};

        items.forEach(item => {
            // Use saved position if available, else use the item's default position
            const savedPos = savedPositions[item.id];
            const defaultPos = item.position;

            initialPositions[item.id] = {
                x: savedPos?.x ?? defaultPos.x,
                y: savedPos?.y ?? defaultPos.y,
                width: savedPos?.width ?? defaultPos.width ?? 100,
                height: savedPos?.height ?? defaultPos.height ?? 100,
            };

            // Use saved style if available, else use the item's default style
            const savedStyle = savedStyles[item.id];
            const defaultStyle = item.style || {};

            initialStyles[item.id] = {
                backgroundColor: savedStyle?.backgroundColor ?? defaultStyle.backgroundColor,
                borderColor: savedStyle?.borderColor ?? defaultStyle.borderColor,
                borderSize: savedStyle?.borderSize ?? defaultStyle.borderSize,
            };
        });

        setPositions(initialPositions);
        setItemStyles(initialStyles);
    }, [items, savedPositions, savedStyles]);

    // Handle mouse down (start dragging)
    const handleMouseDown = (
        e: React.MouseEvent<HTMLDivElement>,
        id: string,
        currentPos: Position
    ) => {
        if (!editMode) return;

        const target = e.target as HTMLElement;
        const isResizeHandle = target.getAttribute('data-resize-handle');

        // Select this item when clicking on it
        setSelectedItem(id);

        if (isResizeHandle) {
            setResizing({
                id,
                handle: isResizeHandle as ResizeHandle
            });
        } else {
            setDragging(id);
            const rect = e.currentTarget.getBoundingClientRect();
            setDragOffset({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            });
        }

        e.preventDefault();
        e.stopPropagation();
    };

    // Handle mouse move for dragging
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const containerRect = e.currentTarget.getBoundingClientRect();

        // Handle resizing
        if (resizing && editMode) {
            const { id, handle } = resizing;
            const pos = positions[id];
            let newWidth = pos.width;
            let newHeight = pos.height;
            let newX = pos.x;
            let newY = pos.y;

            // Calculate new dimensions based on mouse position and resize handle
            const mouseX = e.clientX - containerRect.left;
            const mouseY = e.clientY - containerRect.top;

            if (handle === 'right') {
                newWidth = Math.max(50, mouseX - pos.x);
            } else if (handle === 'bottom') {
                newHeight = Math.max(50, mouseY - pos.y);
            } else if (handle === 'bottom-right') {
                newWidth = Math.max(50, mouseX - pos.x);
                newHeight = Math.max(50, mouseY - pos.y);
            } else if (handle === 'bottom-left') {
                newWidth = Math.max(50, pos.x + pos.width - mouseX);
                newHeight = Math.max(50, mouseY - pos.y);
                newX = mouseX;
            } else if (handle === 'top-right') {
                newWidth = Math.max(50, mouseX - pos.x);
                newHeight = Math.max(50, pos.y + pos.height - mouseY);
                newY = mouseY;
            } else if (handle === 'top-left') {
                newWidth = Math.max(50, pos.x + pos.width - mouseX);
                newHeight = Math.max(50, pos.y + pos.height - mouseY);
                newX = mouseX;
                newY = mouseY;
            }

            // Update position with new dimensions
            setPositions(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    x: newX,
                    y: newY,
                    width: newWidth,
                    height: newHeight
                }
            }));

            return;
        }

        // Handle dragging
        if (dragging && editMode) {
            const newX = e.clientX - containerRect.left - dragOffset.x;
            const newY = e.clientY - containerRect.top - dragOffset.y;

            // Update position
            setPositions(prev => ({
                ...prev,
                [dragging]: {
                    ...prev[dragging],
                    x: Math.max(0, Math.min(newX, containerRect.width - 100)),
                    y: Math.max(0, Math.min(newY, containerRect.height - 100)),
                }
            }));
        }
    };

    // Handle container click (deselect any selected item)
    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Only deselect if clicking directly on the container, not on an item
        if (e.currentTarget === e.target) {
            setSelectedItem(null);
        }
    };

    // Handle mouse up (stop dragging/resizing)
    const handleMouseUp = () => {
        if ((dragging || resizing) && onPositionsChange) {
            onPositionsChange(positions);
        }
        setDragging(null);
        setResizing(null);
    };

    // Update item style
    const updateItemStyle = (id: string, styleUpdate: Partial<ItemStyle>) => {
        const updatedStyles = {
            ...itemStyles,
            [id]: {
                ...itemStyles[id],
                ...styleUpdate
            }
        };

        setItemStyles(updatedStyles);

        // Notify parent component if needed
        if (onItemsChange) {
            const updatedItems = items.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        style: updatedStyles[id]
                    };
                }
                return item;
            });
            onItemsChange(updatedItems);
        }
    };

    // Save positions and styles
    const handleSave = () => {
        if (onPositionsChange) {
            onPositionsChange(positions);
        }

        // In a real app, you would also save the styles
        setEditMode(false);
    };

    // Render resize handles for an item
    const renderResizeHandles = (id: string, isResizable: boolean = true) => {
        if (!editMode || !isResizable) return null;

        const handleStyle: React.CSSProperties = {
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: '#2684FF',
            border: '1px solid white',
            borderRadius: '2px',
            zIndex: 2,
            cursor: 'nwse-resize'
        };

        return (
            <>
                {/* Corner resize handles */}
                <div
                    data-resize-handle="top-left"
                    style={{
                        ...handleStyle,
                        top: '-5px',
                        left: '-5px',
                        cursor: 'nwse-resize'
                    }}
                />
                <div
                    data-resize-handle="top-right"
                    style={{
                        ...handleStyle,
                        top: '-5px',
                        right: '-5px',
                        cursor: 'nesw-resize'
                    }}
                />
                <div
                    data-resize-handle="bottom-left"
                    style={{
                        ...handleStyle,
                        bottom: '-5px',
                        left: '-5px',
                        cursor: 'nesw-resize'
                    }}
                />
                <div
                    data-resize-handle="bottom-right"
                    style={{
                        ...handleStyle,
                        bottom: '-5px',
                        right: '-5px',
                        cursor: 'nwse-resize'
                    }}
                />

                {/* Edge resize handles */}
                <div
                    data-resize-handle="right"
                    style={{
                        ...handleStyle,
                        top: '50%',
                        right: '-5px',
                        transform: 'translateY(-50%)',
                        cursor: 'ew-resize'
                    }}
                />
                <div
                    data-resize-handle="bottom"
                    style={{
                        ...handleStyle,
                        bottom: '-5px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        cursor: 'ns-resize'
                    }}
                />
            </>
        );
    };

    // Render settings panel for selected item
    const renderItemSettings = () => {
        if (!editMode || !selectedItem) return null;

        const style = itemStyles[selectedItem] || {};

        return (
            <Paper p="md" withBorder style={{ marginBottom: '16px' }}>
                <Stack style={{ gap: '8px' }}>
                    <h4 style={{ margin: '0 0 8px 0' }}>Item Settings</h4>

                    <ColorInput
                        label="Background Color"
                        value={style.backgroundColor || '#ffffff'}
                        onChange={(value) => updateItemStyle(selectedItem, { backgroundColor: value })}
                        format="hex"
                        swatchesPerRow={7}
                        withPicker
                    />

                    <ColorInput
                        label="Border Color"
                        value={style.borderColor || '#cccccc'}
                        onChange={(value) => updateItemStyle(selectedItem, { borderColor: value })}
                        format="hex"
                        swatchesPerRow={7}
                        withPicker
                    />

                    <NumberInput
                        label="Border Size (px)"
                        value={style.borderSize || 1}
                        onChange={(value) => updateItemStyle(selectedItem, { borderSize: value as number })}
                        min={0}
                        max={10}
                        step={1}
                    />
                </Stack>
            </Paper>
        );
    };

    // Render component generator
    const renderComponentGenerator = () => {
        if (!editMode || !onAddItem) return null;

        const componentTypes = ['text', 'image', 'vowel', 'container', 'tooltip'];

        return (
            <Paper p="md" withBorder style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0' }}>Add Components</h4>
                <Group style={{ gap: '8px' }}>
                    {componentTypes.map(type => (
                        <Tooltip key={type} label={`Add ${type}`}>
                            <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={() => onAddItem && onAddItem(type)}
                                size="lg"
                            >
                                <PlusIcon />
                                <span style={{ fontSize: '0.7rem', marginLeft: '2px' }}>{type.charAt(0).toUpperCase()}</span>
                            </ActionIcon>
                        </Tooltip>
                    ))}
                </Group>
            </Paper>
        );
    };

    return (
        <Box>
            {editable && (
                <Box mb="md">
                    <Group style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                        <Box>
                            {renderComponentGenerator()}
                            {renderItemSettings()}
                        </Box>
                        <Group style={{ gap: '8px' }}>
                            <Button
                                onClick={() => setEditMode(!editMode)}
                                color={editMode ? 'red' : 'blue'}
                            >
                                {editMode ? 'Cancel Edit' : 'Edit Layout'}
                            </Button>
                            {editMode && <Button onClick={handleSave}>Save Layout</Button>}
                        </Group>
                    </Group>
                </Box>
            )}

            <Box
                style={{
                    position: 'relative',
                    height: `${containerHeight}px`,
                    border: editMode ? '1px dashed #ccc' : 'none',
                    backgroundColor: editMode ? '#f9f9f9' : 'transparent',
                    userSelect: 'none',
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleContainerClick}
            >
                {items.map(item => {
                    const pos = positions[item.id] || {
                        x: 0,
                        y: 0,
                        width: item.position.width || 100,
                        height: item.position.height || 100
                    };
                    const style = itemStyles[item.id] || {};
                    const isActive = dragging === item.id || resizing?.id === item.id;
                    const isSelected = selectedItem === item.id;

                    return (
                        <Box
                            key={item.id}
                            style={{
                                position: 'absolute',
                                left: `${pos.x}px`,
                                top: `${pos.y}px`,
                                width: `${pos.width}px`,
                                height: `${pos.height}px`,
                                cursor: editMode ? 'move' : 'default',
                                transition: isActive ? 'none' : 'all 0.2s ease',
                                zIndex: isActive || isSelected ? 10 : 1,
                                boxShadow: isActive ? '0 5px 15px rgba(0,0,0,0.2)' :
                                    isSelected ? '0 0 0 2px #2684FF' : 'none',
                            }}
                            onMouseDown={(e) => handleMouseDown(e, item.id, pos)}
                        >
                            {renderResizeHandles(item.id, item.resizable !== false)}
                            <div style={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                pointerEvents: editMode ? 'none' : 'auto',
                                backgroundColor: style.backgroundColor || undefined,
                                border: style.borderSize ? `${style.borderSize}px solid ${style.borderColor || '#ccc'}` : undefined
                            }}>
                                {item.content}
                            </div>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
} 