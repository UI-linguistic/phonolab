// File: src/components/ui/Menu.tsx
import React from 'react';
import styled, { css } from 'styled-components';

// -------------------------
// Types & Size Mappings
// -------------------------
export type Orientation = 'horizontal' | 'vertical';
export type Size = 'xs' | 'sm' | 'md' | 'lg';

const sizeStyles = {
  xs: {
    fontSize: '0.8rem',
    padding: '0.4rem 0.8rem',
    gap: '0.4rem',
    width: '150px',
    height: '40px',
  },
  sm: {
    fontSize: '1rem',
    padding: '0.6rem 1rem',
    gap: '0.8rem',
    width: '200px',
    height: '45px',
  },
  md: {
    fontSize: '1.2rem',
    padding: '0.8rem 1.2rem',
    gap: '1.2rem',
    width: '262px',   // fixed width for medium
    height: '50px',
  },
  lg: {
    fontSize: '1.4rem',
    padding: '1rem 1.6rem',
    gap: '1.6rem',
    width: '320px',
    height: '60px',
  },
};

type MenuListProps = {
  items: string[];
  orientation?: Orientation;
  size?: Size;
  activeIndex?: number;
  onSelect?: (index: number) => void;
};

type ActionItem = {
  label: string;
  type: 'submit' | 'reset';
  onClick: () => void;
};

type ActionListProps = {
  actions: ActionItem[];
  size?: Size;
};

// -------------------------
// MenuList (v1 & v2)
// -------------------------
const List = styled.div<{ orientation: Orientation; size: Size }>`
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === 'vertical' ? 'column' : 'row'};
  padding: ${({ theme, size }) => theme.spacing.medium};
  gap: ${({ size }) => sizeStyles[size].gap};
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const ItemButton = styled.button<{
  active: boolean;
  size: Size;
}>`
  /* center text horizontally & vertically */
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ size }) => sizeStyles[size].fontSize};
  /* apply uniform width/height */
  width: ${({ size }) => sizeStyles[size].width};
  height: ${({ size }) => sizeStyles[size].height};
  /* horizontal padding is optional extra inside fixed width/height */
  padding: ${({ size }) => sizeStyles[size].padding};

  border-radius: ${({ theme }) => theme.borderRadius};
  border: 2px solid
    ${({ active, theme }) => (active ? theme.colors.black : theme.colors.secondary)};
  background: ${({ active, theme }) => (active ? theme.colors.secondary : 'transparent')};
  color: ${({ active, theme }) =>
    active ? theme.colors.white : theme.colors.text};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.default},
    color ${({ theme }) => theme.transitions.default};

  /* modern lift effect */
  transition: 
    transform ${({ theme }) => theme.transitions.default},
    box-shadow ${({ theme }) => theme.transitions.default},
    background-color ${({ theme }) => theme.transitions.default},
    color ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${({ active, theme }) =>
    active ? theme.colors.secondary : theme.colors.secondary + '22'};
  }

  &:active {
    transform: translateY(0) scale(1);
    box-shadow: none;
  }
`;

/**
 * Usage:
 * <MenuList
 *   items={['One','Two','Three']}
 *   orientation="vertical"
 *   size="md"
 *   activeIndex={0}
 *   onSelect={i => console.log(i)}
 * />
 */
export function MenuList({
  items,
  orientation = 'vertical',
  size = 'md',
  activeIndex = 0,
  onSelect,
}: MenuListProps) {
  return (
    <List orientation={orientation} size={size}>
      {items.map((label, idx) => (
        <ItemButton
          key={idx}
          active={idx === activeIndex}
          size={size}
          onClick={() => onSelect && onSelect(idx)}
        >
          {label}
        </ItemButton>
      ))}
    </List>
  );
}

// -------------------------
// ActionList (submit & reset)
// -------------------------
const ActionListWrapper = styled.div<{ size: Size }>`
  display: flex;
  flex-direction: column;
  gap: ${({ size }) => sizeStyles[size].gap};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const ActionButton = styled.button<{ actionType: 'submit' | 'reset'; size: Size }>`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: ${({ size }) => sizeStyles[size].fontSize};
  padding: ${({ size }) => sizeStyles[size].padding};
  border-radius: 0;
  border: 2px solid ${({ theme }) => theme.colors.black};
  background: ${({ actionType, theme }) =>
    actionType === 'submit' ? theme.colors.accent : theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  width: ${({ size }) => sizeStyles[size].width};
  height: ${({ size }) => sizeStyles[size].height};
  opacity: 0.6;
  cursor: pointer;

  &:active {
    opacity: 1;
  }
`;

/**
 * Usage:
 * <ActionList
 *   actions=[
 *     { label: 'Submit', type: 'submit', onClick: submitFn },
 *     { label: 'Reset', type: 'reset', onClick: resetFn },
 *   ]
 *   size="sm"
 * />
 */
export function ActionList({ actions, size = 'md' }: ActionListProps) {
  return (
    <ActionListWrapper size={size}>
      {actions.map((act, idx) => (
        <ActionButton
          key={idx}
          actionType={act.type}
          size={size}
          onClick={act.onClick}
        >
          {act.label}
        </ActionButton>
      ))}
    </ActionListWrapper>
  );
}
