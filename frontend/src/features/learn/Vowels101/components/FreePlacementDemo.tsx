import React, { useState } from 'react';
import { Paper, Box, Text } from '@mantine/core';
import { DraggablePositioner } from '@components/ui/DraggablePositioner';

// Example items for the draggable layout
const initialVowelItems = [
    {
        id: 'i',
        position: { x: 50, y: 50, width: 80, height: 80 },
        content: (
            <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px' }}>i</span>
            </Paper>
        ),
        resizable: true,
        style: { backgroundColor: '#f5f5ff', borderColor: '#ccccff', borderSize: 1 }
    },
    {
        id: 'e',
        position: { x: 150, y: 100, width: 80, height: 80 },
        content: (
            <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px' }}>e</span>
            </Paper>
        ),
        resizable: true,
        style: { backgroundColor: '#f0f8ff', borderColor: '#ccccff', borderSize: 1 }
    },
    {
        id: 'æ',
        position: { x: 250, y: 150, width: 80, height: 80 },
        content: (
            <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '20px' }}>æ</span>
            </Paper>
        ),
        resizable: true,
        style: { backgroundColor: '#f0fff0', borderColor: '#ccffcc', borderSize: 1 }
    },
    {
        id: 'tooltip-front',
        position: { x: 150, y: 10, width: 120, height: 40 },
        content: (
            <Paper p="xs" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' }}>
                <span style={{ fontSize: '14px' }}>Front Vowels</span>
            </Paper>
        ),
        resizable: true,
        style: { backgroundColor: '#f0f0f0', borderColor: '#cccccc', borderSize: 1 }
    },
    {
        id: 'diagram',
        position: { x: 400, y: 100, width: 200, height: 200 },
        content: (
            <Paper p="lg" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Tongue Position Diagram</span>
            </Paper>
        ),
        resizable: true,
        style: { backgroundColor: '#fff8f0', borderColor: '#ffccaa', borderSize: 1 }
    },
];

// Function to create a new component based on type
const createNewComponent = (type: string, items: any[]) => {
    const newId = `${type}-${Date.now()}`;
    const lastItem = items[items.length - 1];
    const newX = lastItem ? lastItem.position.x + 50 : 100;
    const newY = lastItem ? lastItem.position.y + 50 : 100;

    let content;
    let style = { backgroundColor: '#ffffff', borderColor: '#cccccc', borderSize: 1 };
    let width = 100;
    let height = 100;

    switch (type) {
        case 'text':
            content = (
                <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Text Label</Text>
                </Paper>
            );
            width = 120;
            height = 60;
            break;
        case 'image':
            content = (
                <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
                    <Text>Image Placeholder</Text>
                </Paper>
            );
            width = 150;
            height = 150;
            style = { backgroundColor: '#f0f0f0', borderColor: '#dddddd', borderSize: 1 };
            break;
        case 'vowel':
            const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'ə', 'ɪ', 'ʊ'];
            const randomVowel = vowels[Math.floor(Math.random() * vowels.length)];
            content = (
                <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '24px' }}>{randomVowel}</span>
                </Paper>
            );
            width = 80;
            height = 80;
            style = { backgroundColor: '#f5f5ff', borderColor: '#ccccff', borderSize: 1 };
            break;
        case 'container':
            content = (
                <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Container</Text>
                </Paper>
            );
            width = 200;
            height = 200;
            style = { backgroundColor: '#fffff0', borderColor: '#ffffcc', borderSize: 2 };
            break;
        case 'tooltip':
            content = (
                <Paper p="xs" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text size="sm">Tooltip</Text>
                </Paper>
            );
            width = 100;
            height = 40;
            style = { backgroundColor: '#f0f0f0', borderColor: '#cccccc', borderSize: 1 };
            break;
        default:
            content = (
                <Paper p="md" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Text>New Component</Text>
                </Paper>
            );
    }

    return {
        id: newId,
        position: { x: newX, y: newY, width, height },
        content,
        resizable: true,
        style
    };
};

export default function FreePlacementDemo() {
    // State for items, positions, and styles
    const [items, setItems] = useState(initialVowelItems);
    const [savedPositions, setSavedPositions] = useState<Record<string, any>>({});
    const [savedStyles, setSavedStyles] = useState<Record<string, any>>({});

    // Handle position changes
    const handlePositionsChange = (newPositions: Record<string, any>) => {
        setSavedPositions(newPositions);
        // In a real app, you would save this to backend/localStorage
        console.log('New positions saved:', newPositions);
    };

    // Handle item style changes
    const handleItemsChange = (updatedItems: any[]) => {
        setItems(updatedItems);

        // Extract and save styles
        const newStyles: Record<string, any> = {};
        updatedItems.forEach(item => {
            if (item.style) {
                newStyles[item.id] = item.style;
            }
        });

        setSavedStyles(newStyles);
        console.log('Updated items with styles:', updatedItems);
    };

    // Handle adding a new component
    const handleAddItem = (itemType: string) => {
        const newComponent = createNewComponent(itemType, items);
        setItems([...items, newComponent]);
        console.log(`Added new ${itemType} component`, newComponent);
    };

    return (
        <Box>
            <h3 style={{ marginBottom: '1rem' }}>Custom Vowel Layout</h3>
            <p style={{ marginBottom: '1.5rem' }}>You can freely position elements by entering edit mode and dragging them. Click Edit Layout to resize and move items.</p>

            <DraggablePositioner
                items={items}
                editable={true}
                containerHeight={500}
                onPositionsChange={handlePositionsChange}
                onItemsChange={handleItemsChange}
                savedPositions={savedPositions}
                savedStyles={savedStyles}
                onAddItem={handleAddItem}
            />

            <p style={{ marginTop: '1rem', fontSize: '14px', color: '#666' }}>
                Note: Drag to move items. Use the blue handles to resize items. Select an item to customize its appearance.
            </p>
        </Box>
    );
} 