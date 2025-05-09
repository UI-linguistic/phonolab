// src/features/learn/Vowels101/Vowels101.styles.ts
/**
 * Vowels101.styles
 *
 * Styled‑components definitions for the Vowels101 lesson:
 *  - VowelsGrid: grid container for 3×3 layout
 *  - CellContainer & CellContent: square cells with centered auto‑layout
 *  - Plus supporting styles for tabs, images, and navigation rows
 */
import styled from 'styled-components';
import { GridMode } from '../../../components/ui/Grid';

// Tabs
export const Tabs = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid #e86c2a;
  background: ${({ active }) => (active ? '#e86c2a' : 'transparent')};
  color: ${({ active }) => (active ? 'white' : 'black')};
  border-radius: 0.5rem;
  cursor: pointer;
`;

// Section container (grid + image)
export const SectionContainer = styled.div`
  display: flex;
  gap: 2rem;
`;

// Section container (grid + image)
export const Pane = styled.div`
  outline: 1px dashed rgba(128, 0, 128, 0.6);
  padding: ${({ theme }) => theme.spacing.medium};
`;

// Image display
export const Img = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 1rem;
`;

// Length list
export const LengthList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const LengthItem = styled.li`
  margin: 0.5rem 0;
`;

// Back button row
export const BackRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  outline: 2px dashed rgba(255, 165, 0, 0.6);
`;
