// File: src/components/ui/Grid.tsx
import styled from 'styled-components';

export interface GridProps {
    cols: number;
    rows?: number;
    gap?: string;
}

const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: repeat(${props => props.cols}, 1fr);
  ${props =>
        props.rows !== undefined &&
        `grid-template-rows: repeat(${props.rows}, auto);`}
  gap: ${props => props.gap ?? props.theme.spacing.medium};
`;

export default Grid;
