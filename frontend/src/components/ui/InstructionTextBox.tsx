
/**
 * InstructionBox.tsx
 *
 * A flexible “instruction container” that:
 *  - Wraps arbitrary React nodes in a parent Cell
 *  - Two modes:
 *      • v1: transparent background, black border, no hover
 *      • v2: transparent background, no border, no hover
 *  - Stacks its children in a flex row or column with configurable gap
 *  - Props:
 *      • mode:        'v1' | 'v2'  (controls parent border/hover)
 *      • direction:   'row' | 'column'
 *      • gap:         number (px)
 *      • children:    ReactNode[]   (any text, images, JSX blocks)
 *      • Plus all other CellProps: draggable, onClick, style, etc.
 *
 * Usage:
 *   <InstructionBox mode="v1" direction="column" gap={16}>
 *     <p>Step 1: Read the instructions carefully.</p>
 *     <p>Step 2: Click “Next” to continue.</p>
 *   </InstructionBox>
 */

import React from 'react';
import { Cell, CellProps } from './Cell';

export type InstructionBoxMode = 'v1' | 'v2';

export interface InstructionBoxProps
    extends Omit<CellProps, 'variant' | 'children'> {
    /** Which style of instruction box */
    mode?: InstructionBoxMode;

    /** Row or column stacking of inner items */
    direction?: 'row' | 'column';

    /** Gap between stacked children, in px */
    gap?: number;

    /** Any kind of content: text, images, JSX… */
    children: React.ReactNode[];
}

export const InstructionBox: React.FC<InstructionBoxProps> = ({
    mode = 'v1',
    direction = 'column',
    gap = 12,
    children,
    ...cellProps
}) => {
    const parentStyle =
        mode === 'v1'
            ? { background: 'transparent', border: '2px solid #000' }
            : { background: 'transparent', border: 'none' };

    const parentProps: CellProps = {
        variant: 'default',
        hoverable: false,
        activeable: false,
        style: parentStyle,
        ...cellProps,     // this can include draggable, onClick, etc.
    };

    return (
        <Cell {...parentProps}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: direction,
                    gap: `${gap}px`,
                    width: '100%',
                }}
            >
                {children.map((c, i) => (
                    <div key={i} style={{ flex: 1 }}>
                        {c}
                    </div>
                ))}
            </div>
        </Cell>
    );
};
