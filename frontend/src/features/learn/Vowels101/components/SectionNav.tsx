// src/components/SectionNav.tsx
import React from 'react';
import styled from 'styled-components';

type SectionNavProps = {
    sections: readonly string[];
    activeIndex: number;
    onChange: (i: number) => void;
};

export const SectionNav: React.FC<SectionNavProps> = ({
    sections,
    activeIndex,
    onChange
}) => (
    <NavRow>
        {sections.map((label, i) => (
            <NavButton
                key={i}
                active={i === activeIndex}
                onClick={() => onChange(i)}
            >
                {label}
            </NavButton>
        ))}
    </NavRow>
);

const NavRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};

  outline: 2px dashed rgba(255, 0, 0, 0.6);
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing.small}
           ${({ theme }) => theme.spacing.medium};
  background: ${({ active, theme }) =>
        active ? theme.colors.secondary : 'transparent'};
  color: ${({ active, theme }) =>
        active ? theme.colors.white : theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  &:hover {
    background: ${({ theme }) => theme.colors.cellHoverPrimary};
  }
`;
