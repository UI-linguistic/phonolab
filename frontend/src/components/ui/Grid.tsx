// src/components/Grid.tsx

// THIS IS ABOUT TO BE DEPRECATED
// USE InteractiveCollection.tsx FILE INSTEAD

import React, { useState } from 'react';
import styled from 'styled-components';
import {
    DndContext,
    closestCenter,
    DragEndEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { Cell } from './Celldeprecated';
import { Vowel } from '../../features/learn/Vowels101/types';


export type GridMode = 'lesson' | 'quiz';

export type Placement = {
    id: string;
    row: number;
    col: number;
    frames: Vowel[];
};

export type GridProps = {
    mode: GridMode;
    items: Placement[];
    onReorder: (newItems: Placement[]) => void;
    activeCellId: string | null;
    activeVowelId: number | null;
    onFrameClick: (cellId: string, vowel: Vowel) => void;
};

export const Grid: React.FC<GridProps> = ({
    mode,
    items,
    onReorder,
    activeCellId,
    activeVowelId,
    onFrameClick
}) => {
    const draggable = mode === 'quiz';
    const [gridHover, setGridHover] = useState(false);

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex(i => i.id === active.id);
            const newIndex = items.findIndex(i => i.id === over.id);
            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    };

    const cellGrid = (
        <CellGrid
            onMouseEnter={() => setGridHover(true)}
            onMouseLeave={() => setGridHover(false)}
        >
            {items.map(item => (
                <div key={item.id}> {/* wrapper positions the cell */}
                    <Cell
                        id={item.id}
                        draggable={draggable}
                        gridHover={gridHover}
                        frames={item.frames}
                        onFrameClick={onFrameClick}
                        isActiveCell={item.id === activeCellId}
                        activeVowelId={activeVowelId}
                    />
                </div>
            ))}
        </CellGrid>
    );

    const content = draggable ? (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)}>{cellGrid}</SortableContext>
        </DndContext>
    ) : (
        cellGrid
    );

    return (
        <GridWrapper>
            <Corner />
            <ColHeaders>
                {['Front', 'Central', 'Back'].map(label => (
                    <HeaderCell key={label}>{label}</HeaderCell>
                ))}
            </ColHeaders>
            <RowHeaders>
                {['High', 'Mid', 'Low'].map(label => (
                    <HeaderCell key={label}>{label}</HeaderCell>
                ))}
            </RowHeaders>
            <CellsContainer mode={mode}>{content}</CellsContainer>
        </GridWrapper>
    );
};

export default Grid;

// /** ─────────────────────────────────────────────────────────────
//  * Styled Components
//  * ─────────────────────────────────────────────────────────────
//  */

// const GridContainer = styled.div<{ mode: GridMode }>`
//   width: 100%;
//   max-width: 600px;
//   margin: 0 auto;
//   padding: ${({ theme }) => theme.spacing.medium};
//   box-sizing: border-box;

//   border: 2px solid
//     ${({ mode, theme }) =>
//         mode === 'quiz' ? theme.colors.primary : theme.colors.secondary};
//   border-radius: ${({ theme }) => theme.borderRadius};
// `;

// const StyledGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: ${({ theme }) => theme.spacing.small};

//   /* ensure each child (the CellContainer) is square */
//   & > div {
//     aspect-ratio: 1;
//   }
// `;


/** ─────────────────────────────────────────────────────────────
 * Styled Components with Debug Outlines
 * ─────────────────────────────────────────────────────────────
 */


// The outermost 2×2 grid: [ corner | col-headers ]
//                          [ row-hdr | cells      ]
const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  gap: ${({ theme }) => theme.spacing.small};
`;

/* Invisible top-left corner */
const Corner = styled.div``;

/* Column headers — simple row of 3 labels */
const ColHeaders = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: ${({ theme }) => theme.spacing.xsmall} 0;
`;

const RowHeaders = styled.div`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  padding: 0 ${({ theme }) => theme.spacing.xsmall};

  /* center each child horizontally and vertically */
  justify-items: center;
  align-items: center;
`;

/* Shared header cell style */
const HeaderCell = styled.div`
  font-weight: bold;
  text-align: center;
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.xsmall}`};

  /* make sure this cell sits dead‑center in its grid slot */
  justify-self: center;
  align-self: center;
`;

/* The box around the 3×3 grid (with its own debug border) */
const CellsContainer = styled.div<{ mode: GridMode }>`
  width: 100%;
  max-width: 350px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};
  border: 2px solid
    ${({ mode, theme }) => (mode === 'quiz'
        ? theme.colors.primary
        : theme.colors.secondary)};
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: 2px dashed rgba(255, 0, 0, 0.6);
`;

/* The actual 3×3 cell layout, no headers */
const CellGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.small};
  outline: 2px dashed rgba(0, 0, 255, 0.6);

  & > div {
    aspect-ratio: 1;
    outline: 1px dashed rgba(0, 255, 0, 0.6);
  }
`;