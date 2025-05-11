/**
 * Menu.tsx
 *
 * Provides two core UI list components for menus and actions:
 *
 * 1. MenuList
 *    – Renders a list of buttons in either horizontal or vertical orientation.
 *    – Auto‑centers buttons and spaces them evenly.
 *    – Supports four size tokens ('xs' | 'sm' | 'md' | 'lg') controlling:
 *        • fontSize
 *        • padding
 *        • gap between buttons
 *        • min-width and min-height for uniform sizing
 *    – Active button is styled with solid background & black border; inactive are outlined.
 *    – Modern lift effect on hover (translateY + scale + shadow).
 *
 *    Props:
 *      • items:        string[]                       — button labels
 *      • orientation?: 'horizontal' | 'vertical'     — layout direction (default 'vertical')
 *      • size?:        Size                          — token for sizing (default 'md')
 *      • activeIndex?: number                        — index of the active button (default 0)
 *      • onSelect?:    (index: number) ⇒ void       — called when a button is clicked
 *
 *    Usage:
 *      <MenuList
 *        items={['One','Two','Three']}
 *        orientation="row"
 *        size="sm"
 *        activeIndex={1}
 *        onSelect={i => console.log('clicked', i)}
 *      />
 *
 * 2. ActionList
 *    – Renders a vertical stack of Submit/Reset style buttons.
 *    – Buttons share the same size tokens as MenuList.
 *    – Submit uses the theme.accent background; Reset uses theme.secondary.
 *    – No border‑radius; black border; opacity change on click.
 *
 *    Props:
 *      • actions:      { label: string; type: 'submit'|'reset'; onClick:()=>void }[]
 *      • size?:        Size                          — token for sizing (default 'md')
 *
 *    Usage:
 *      <ActionList
 *        actions={[
 *          { label: 'Submit', type: 'submit', onClick: handleSubmit },
 *          { label: 'Reset',  type: 'reset',  onClick: handleReset }
 *        ]}
 *        size="lg"
 *      />
 *
 * Size Tokens (sizeStyles):
 *   xs: { fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.4rem', width: '150px', height: '40px' }
 *   sm: { fontSize: '1rem',   padding: '0.6rem 1rem',   gap: '0.8rem', width: '200px', height: '45px' }
 *   md: { fontSize: '1.2rem', padding: '0.8rem 1.2rem', gap: '1.2rem', width: '300px', height: '50px' }
 *   lg: { fontSize: '1.4rem', padding: '1rem 1.6rem',   gap: '1.6rem', width: '320px', height: '60px' }
 */

import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';

// -------------------------
// Types & Size Mappings
// -------------------------
export type Orientation = 'horizontal' | 'vertical';
export type Size = 'xs' | 'sm' | 'md' | 'lg';
type SpacingKey = keyof DefaultTheme['spacing'];
type FontFamilyKey = keyof DefaultTheme['fonts'];
type FontWeightKey = keyof DefaultTheme['fontWeights'];

type MenuListProps = {
  items: string[];
  orientation?: Orientation;
  size?: Size;
  activeIndex?: number;
  onSelect?: (index: number) => void;

  /** gap between buttons */
  itemGap?: string;

  /** left/right padding: CSS or theme.spacing key */
  horizontalPadding?: keyof DefaultTheme['spacing'] | string;

  /** uniform button width (overrides sizeStyles[size].width) */
  buttonWidth?: string;

  /** pick theme.fonts.main or theme.fonts.heading */
  textFamily?: FontFamilyKey;

  /** pick theme.fontWeights.light | normal | medium | bold */
  textWeight?: FontWeightKey;

  /** normal | italic | oblique */
  textStyle?: 'normal' | 'italic' | 'oblique';

  /** override text color via theme.colors */
  textColor?: keyof DefaultTheme['colors'];
};

const sizeStyles = {
  xs: { fontSize: '0.8rem', padding: '0.4rem 0.8rem', gap: '0.4rem', width: '150px', height: '40px' },
  sm: { fontSize: '1rem', padding: '0.6rem 1rem', gap: '0.8rem', width: '200px', height: '45px' },
  md: { fontSize: '1.2rem', padding: '0.8rem 1.2rem', gap: '1.2rem', width: '300px', height: '50px' },
  lg: { fontSize: '1.4rem', padding: '1rem 1.6rem', gap: '1.6rem', width: '320px', height: '60px' },
};


type ActionItem = {
  label: string;
  type: 'submit' | 'reset';
  onClick: () => void;
  textFamily?: FontFamilyKey;
  textWeight?: FontWeightKey;
  textStyle?: 'normal' | 'italic' | 'oblique';
  textColor?: keyof DefaultTheme['colors'];
};

type ActionListProps = {
  actions: ActionItem[];
  size?: Size;
  itemGap?: string;
  textFamily?: FontFamilyKey;
  textWeight?: FontWeightKey;
  textStyle?: 'normal' | 'italic' | 'oblique';
  textColor?: keyof DefaultTheme['colors'];
};

// -------------------------
// MenuList (v1 & v2)
// -------------------------
const List = styled.div<{ orientation: Orientation; size: Size; itemGap?: string; }>`
  display: flex;
  flex-direction: ${({ orientation }) =>
    orientation === 'vertical' ? 'column' : 'row'};
  padding: ${({ theme, size }) => theme.spacing.medium};
  gap: ${({ size, itemGap }) => itemGap ? itemGap : sizeStyles[size].gap};
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const ItemButton = styled.button<{
  $active: boolean;
  size: Size;
  horizontalPadding?: string;
  widthOverride?: string;
  textFamily?: FontFamilyKey;
  textWeight?: FontWeightKey;
  textStyle?: 'normal' | 'italic' | 'oblique';
  textColor?: keyof DefaultTheme['colors'];
}>`
  box-sizing: border-box;     /* ← so padding lives *inside* that width */
  display: flex;
  align-items: center;
  justify-content: center;

  /* 1) Font family */
  font-family: ${({ theme, textFamily }) =>
    theme.fonts[textFamily ?? 'main']};

  /* 2) Font size from your sizeStyles */
  font-size: ${({ size }) => sizeStyles[size].fontSize};

  /* 3) Font weight */
  font-weight: ${({ theme, textWeight }) =>
    theme.fontWeights[textWeight ?? 'normal']};

  /* 4) Font style */
  font-style: ${({ textStyle }) => textStyle ?? 'normal'};

  /* 5) Text color (overrides active/inactive defaults) */
  color: ${({ theme, $active, textColor }) =>
    textColor
      ? theme.colors[textColor]
      : $active
        ? theme.colors.white
        : theme.colors.text};

  /* padding: split the default, swap in your override if given */
  ${({ size, horizontalPadding, theme }) => {
    const [vert, hor] = sizeStyles[size].padding.split(' ');
    const finalHor = horizontalPadding && (theme.spacing as any)[horizontalPadding]
      ? (theme.spacing as any)[horizontalPadding]
      : horizontalPadding ?? hor;
    return `padding: ${vert} ${finalHor};`;
  }}

  /* uniform width: override or fallback to your sizeStyles width */
  width: ${({ widthOverride, size }) =>
    widthOverride ?? sizeStyles[size].width};
  min-width: ${({ widthOverride, size }) =>
    widthOverride ?? sizeStyles[size].width};
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 2px solid
    ${({ $active, theme }) =>
    $active ? theme.colors.black : theme.colors.secondary};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.secondary : 'transparent'};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.white : theme.colors.text};
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.transitions.default},
    box-shadow ${({ theme }) => theme.transitions.default},
    background-color ${({ theme }) => theme.transitions.default},
    color ${({ theme }) => theme.transitions.default};

  &:hover {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: ${({ $active, theme }) =>
    $active
      ? theme.colors.secondary
      : theme.colors.secondary + '22'};
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
  itemGap,
  horizontalPadding,
  buttonWidth,
  textFamily,
  textWeight,
  textStyle,
  textColor,
}: MenuListProps) {
  return (
    <List orientation={orientation} size={size} itemGap={itemGap}>
      {items.map((label, idx) => (
        <ItemButton
          key={label}
          size={size}
          $active={idx === activeIndex}
          onClick={() => onSelect?.(idx)}
          horizontalPadding={horizontalPadding}
          widthOverride={buttonWidth}
          textFamily={textFamily}
          textWeight={textWeight}
          textStyle={textStyle}
          textColor={textColor}
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
const ActionListWrapper = styled.div<{ size: Size; itemGap?: string; }>`
  display: flex;
  flex-direction: column;
  gap: ${({ size, itemGap }) => itemGap ? itemGap : sizeStyles[size].gap};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const ActionButton = styled.button<{ actionType: 'submit' | 'reset'; size: Size; textFamily?: FontFamilyKey; textWeight?: FontWeightKey; textStyle?: 'normal' | 'italic' | 'oblique'; textColor?: keyof DefaultTheme['colors']; }>`
  font-family: ${({ theme, textFamily }) =>
    theme.fonts[textFamily ?? 'main']};
  font-size: ${({ size }) => sizeStyles[size].fontSize};
  font-weight: ${({ theme, textWeight }) =>
    theme.fontWeights[textWeight ?? 'normal']};
  font-style: ${({ textStyle }) => textStyle ?? 'normal'};
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
export function ActionList({ actions, size = 'md', itemGap, textFamily, textWeight, textStyle, textColor }: ActionListProps) {
  return (
    <ActionListWrapper size={size} itemGap={itemGap}>
      {actions.map((act, idx) => (
        <ActionButton
          key={idx}
          actionType={act.type}
          size={size}
          onClick={act.onClick}
          textFamily={textFamily}
          textWeight={textWeight}
          textStyle={textStyle}
          textColor={textColor}
        >
          {act.label}
        </ActionButton>
      ))}
    </ActionListWrapper>
  );
}
