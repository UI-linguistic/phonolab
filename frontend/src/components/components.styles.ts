import { styled } from "styled-components";
import { GridMode } from "./ui/Grid";


/**
 * A horizontal section containing BackButton + optional title
 */
export const BackRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`

/**
 * A two‑column (left/right) content area with a breakpoint
 */
export const TwoCol = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.large};

  @media (max-width: 900px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.large};
  }
`

/**
 * A fixed‑aspect circle wrapper (for Illustrations)
 */
export const CircleWrapper = styled.div<{
  sizePx?: number
}>`
  position: relative;
  width: 100%;
  max-width: ${({ sizePx }) => (sizePx ? `${sizePx}px` : '600px')};
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.colors.text}33`};
  border: 2px solid ${({ theme }) => `${theme.colors.black}66`};
  display: flex;
  align-items: center;
  justify-content: center;
`

/**
 * A vertical list of buttons (for menu)
 */
export const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  max-width: 300px;

  @media (max-width: 900px) {
    max-width: 100%;
    margin: 0 auto;
  }
`


export const Frame = styled.div<{
  active?: boolean;
}>`
  /* …base styles… */
  transition: background-color ${({ theme }) => theme.transitions.default};

  /* Base background when active */
  background-color: ${({ theme, active }) =>
    active
      ? theme.colors.frameActivePrimary
      : 'transparent'};

  /* Hover when not active */
  &:hover {
    background-color: ${({ theme, active }) =>
    active
      ? theme.colors.frameActivePrimary  // stay strong yellow
      : theme.colors.frameHoverPrimary}; // light yellow
  }
`;

// Cell
export const CellContainer = styled.div<{
  draggable: boolean;
  active?: boolean;
  gridHover: boolean;
}>`
  position: relative;
  width: 100%;
  padding-top: 100%;
  box-sizing: border-box;

  /* Active state (strong orange) */
  background-color: ${({ theme, active }) =>
    active ? theme.colors.cellActivePrimary : 'transparent'};

  /* Lesson‑mode hover: apply on **any** grid hover */
  ${({ draggable, gridHover, theme }) =>
    !draggable && gridHover &&
    `
    background-color: ${theme.colors.cellHoverPrimary};
    transition: background-color ${theme.transitions.default};
  `}

  /* Quiz mode cursor */
  cursor: ${({ draggable }) => (draggable ? 'grab' : 'pointer')};
`;

export const CellContent = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px; /* uniform gap like your Figma auto-layout */
`;

// Grid
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
`;

// Vowels grid wrapper (3×3)
export const VowelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.small}px;

  /* maintain square cells responsively */
  & > ${CellContainer} {
    aspect-ratio: 1;         /* modern browsers */
  }
`;