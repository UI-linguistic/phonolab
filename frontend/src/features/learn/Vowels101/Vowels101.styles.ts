// src/features/learn/Vowels101/Vowels101.styles.ts
import styled from 'styled-components';

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

// Grid
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
`;

// Cell
export const Cell = styled.div<{ hovered: boolean; selected: boolean }>`
  border: 1px solid #333;
  padding: 1rem;
  text-align: center;
  background: ${({ selected, hovered }) =>
    selected ? '#e86c2a' : hovered ? '#f5f5f5' : 'transparent'};
  cursor: pointer;
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
`;

// Footer navigation row
export const FooterNavRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
`;