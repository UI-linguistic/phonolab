import React from 'react';
import styled from 'styled-components';
import { VowelGridCell } from '../types';

interface Props {
    cell: VowelGridCell;
    isHovered: boolean;
    isSelected: boolean;
    onHover: (enter: boolean) => void;
    onClick: () => void;
    children: React.ReactNode;
}

export const VowelCell: React.FC<Props> = ({
    cell,
    isHovered,
    isSelected,
    onHover,
    onClick,
    children
}) => {
    return (
        <CellContainer
            isHovered={isHovered}
            isSelected={isSelected}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            onClick={onClick}
            lipType={cell.lip_type}
            lengthType={cell.length_type}
        >
            {children}
        </CellContainer>
    );
};

const CellContainer = styled.div<{
    isHovered: boolean;
    isSelected: boolean;
    lipType?: string;
    lengthType?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Orange background for selected cell, lighter orange for hovered */
  background-color: ${props =>
        props.isSelected ? 'var(--color-secondary)' :
            props.isHovered ? 'rgba(255, 165, 0, 0.3)' :
                'rgba(240, 240, 240, 0.5)'
    };
  
  border: 1px solid ${props =>
        props.isSelected ? 'var(--color-secondary-dark)' :
            props.isHovered ? 'rgba(255, 165, 0, 0.5)' :
                'rgba(200, 200, 200, 0.5)'
    };
  
  /* Optional: Add visual indicators for lip and length types */
  ${props => props.lipType === 'rounded' && `
    box-shadow: inset 0 -3px 0 rgba(0, 0, 255, 0.2);
  `}
  
  ${props => props.lengthType === 'long' && `
    box-shadow: inset 3px 0 0 rgba(0, 128, 0, 0.2);
  `}
`;
