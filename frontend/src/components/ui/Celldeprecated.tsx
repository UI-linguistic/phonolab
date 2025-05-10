


// THIS IS ABOUT TO BE DEPRECATED
// USE InteractiveCollection.tsx or Cell.tsx FILE INSTEAD


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
