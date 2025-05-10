/**
 * PhonemeBox.tsx
 *
 * A configurable “phoneme cell” that:
 *  - Renders an outer Cell with transparent background & black border
 *  - Always hoverable on the parent; click plays audio (onPlay)
 *  - Contains an inner “layout” Cell:
 *      • Optional 🔊 icon on the left
 *      • Inner content (label) scaled to parent size
 *      • Two modes for hover color:
 *          – v1: child hover inherits parent’s hoverBorderColor/hoverBg
 *          – v2: child hover uses its own default or passed-in colors
 *  - Props:
 *      • label:       ReactNode (text, image, whatever glyph)
 *      • mode:        'v1' | 'v2'  (controls child hover behavior)
 *      • onPlay:      () ⇒ void   (audio play callback)
 *      • All other CellProps: draggable, hoverBg, hoverBorderColor, activeable, etc.
 *
 * Usage:
 *   <PhonemeBox
 *     label={<span style={{color:'#0a9'}}>i</span>}
 *     mode="v1"
 *     onPlay={() => playSound('i')}
 *     draggable
 *   />
 */

import React from 'react';
import { Cell, CellProps } from './Cell';
import { ReactComponent as AudioIcon } from '@assets/images/icons/AudioIcon.svg';

export type PhonemeBoxMode = 'v1' | 'v2';

export interface PhonemeBoxProps
    // we omit only those props we’ll set ourselves:
    extends Omit<
        CellProps,
        'variant' | 'children' | 'icon' | 'iconPosition'
    > {
    /** The phoneme glyph (text, image, whatever) */
    label: React.ReactNode;

    /** Which flavor of box to render */
    mode?: PhonemeBoxMode;

    /** Play button callback */
    onPlay?: () => void;
}

export const PhonemeBox: React.FC<PhonemeBoxProps> = ({
    label,
    mode = 'v1',
    onPlay,
    hoverBg,
    hoverBorderColor,
    ...cellProps
}) => {
    //
    // 1) Configure the *outer* Cell
    //
    const outerProps: CellProps = {
        variant: 'default',    // plain BaseCell
        hoverable: true,       // always hoverable
        activeable: false,
        onClick: onPlay,       // clicking plays sound
        style: undefined,      // <— remove if you don’t extend HTMLAttributes
        ...cellProps,          // e.g. draggable, other overrides
    };

    //
    // 2) Decide child hover colors
    //
    const childBg =
        mode === 'v2' ? hoverBg ?? 'rgba(255,96,0,0.1)' : undefined;
    const childBorder =
        mode === 'v2' ? hoverBorderColor ?? '#f60' : undefined;

    return (
        <Cell {...outerProps}>
            {/* inner “layout” cell holds icon+label */}
            <Cell
                variant="layout"
                icon={<AudioIcon onClick={onPlay} />}
                iconPosition="left"
                hoverable={mode === 'v2'}
                hovered={false}
                hoverBg={childBg}
                hoverBorderColor={childBorder}
                framePadX={8}
                framePadY={4}
            >
                {label}
            </Cell>
        </Cell>
    );
};
