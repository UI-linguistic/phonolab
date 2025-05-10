// src/features/learn/Vowels101/Cell.tsx
/**
 * Cell
 *
 * Represents one square of the 3×3 Vowels grid. In “drag” mode it becomes sortable via dnd‑kit;
 * in “fixed” mode it renders up to two Frame children that play vowel sounds on click.
 * Handles applying drag transforms and wiring up the appropriate event handlers.
 */
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Vowel } from '../../features/learn/Vowels101/types';
import { CellContainer, CellContent, Frame } from '@components/components.styles';


type CellProps = {
    id: string;
    draggable: boolean;
    gridHover: boolean;
    frames: Vowel[];
    /** Called with (cellId, vowel) when a frame is clicked */
    onFrameClick: (cellId: string, vowel: Vowel) => void;
    /** The cell is active if one of its frames is active */
    isActiveCell: boolean;
    /** ID of the active vowel (if any) */
    activeVowelId: number | null;
};

export const Cell: React.FC<CellProps> = ({
    id,
    draggable,
    gridHover,
    frames,
    onFrameClick,
    isActiveCell,
    activeVowelId,
}) => {
    // dnd‑kit hook: disabled when not draggable
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id, disabled: !draggable });

    // Apply transform only in drag mode
    const style = draggable
        ? { transform: CSS.Transform.toString(transform), transition }
        : undefined;

    return (
        <CellContainer
            ref={draggable ? setNodeRef : undefined}
            style={style}
            active={isActiveCell}
            draggable={draggable}
            gridHover={gridHover}
            {...(draggable ? { ...attributes, ...listeners } : {})}
        >
            <CellContent>
                {frames.map(vowel => {
                    const isActiveFrame = vowel.id === activeVowelId;

                    return (
                        <Frame
                            key={vowel.id}
                            active={isActiveFrame}
                            onClick={
                                !draggable
                                    ? e => {
                                        e.stopPropagation();
                                        onFrameClick(id, vowel);
                                    }
                                    : undefined
                            }
                        >
                            {vowel.ipa}
                        </Frame>
                    );
                })}
            </CellContent>
        </CellContainer>
    );
};
