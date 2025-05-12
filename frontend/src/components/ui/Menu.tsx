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

// Updated size styles with responsive values
const getSizeStyles = (theme: DefaultTheme) => ({
  xs: {
    fontSize: theme.fontSizes.sm || '0.8rem',
    padding: {
      mobile: '0.3rem 0.6rem',
      tablet: '0.4rem 0.8rem',
      desktop: '0.4rem 0.8rem',
      widescreen: '0.5rem 1rem'
    },
    gap: {
      mobile: '0.3rem',
      tablet: '0.4rem',
      desktop: '0.4rem',
      widescreen: '0.5rem'
    },
    width: {
      mobile: '120px',
      tablet: '150px',
      desktop: '150px',
      widescreen: '180px'
    },
    height: {
      mobile: '36px',
      tablet: '40px',
      desktop: '40px',
      widescreen: '44px'
    }
  },
  sm: {
    fontSize: theme.fontSizes.md || '1rem',
    padding: {
      mobile: '0.4rem 0.8rem',
      tablet: '0.6rem 1rem',
      desktop: '0.6rem 1rem',
      widescreen: '0.7rem 1.2rem'
    },
    gap: {
      mobile: '0.6rem',
      tablet: '0.8rem',
      desktop: '0.8rem',
      widescreen: '1rem'
    },
    width: {
      mobile: '160px',
      tablet: '200px',
      desktop: '200px',
      widescreen: '220px'
    },
    height: {
      mobile: '40px',
      tablet: '45px',
      desktop: '45px',
      widescreen: '50px'
    }
  },
  md: {
    fontSize: theme.fontSizes.lg || '1.2rem',
    padding: {
      mobile: '0.6rem 1rem',
      tablet: '0.8rem 1.2rem',
      desktop: '0.8rem 1.2rem',
      widescreen: '1rem 1.4rem'
    },
    gap: {
      mobile: '0.8rem',
      tablet: '1.2rem',
      desktop: '1.2rem',
      widescreen: '1.4rem'
    },
    width: {
      mobile: '220px',
      tablet: '300px',
      desktop: '300px',
      widescreen: '320px'
    },
    height: {
      mobile: '45px',
      tablet: '50px',
      desktop: '50px',
      widescreen: '55px'
    }
  },
  lg: {
    fontSize: theme.fontSizes.xl || '1.4rem',
    padding: {
      mobile: '0.8rem 1.2rem',
      tablet: '1rem 1.6rem',
      desktop: '1rem 1.6rem',
      widescreen: '1.2rem 2rem'
    },
    gap: {
      mobile: '1.2rem',
      tablet: '1.6rem',
      desktop: '1.6rem',
      widescreen: '2rem'
    },
    width: {
      mobile: '260px',
      tablet: '320px',
      desktop: '320px',
      widescreen: '360px'
    },
    height: {
      mobile: '50px',
      tablet: '60px',
      desktop: '60px',
      widescreen: '65px'
    }
  },
});

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
  gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.mobile;
  }};
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  
  /* Responsive gap adjustments */
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.tablet;
  }};
  }
  
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.desktop;
  }};
  }
  
  @media ${({ theme }) => theme.media.widescreen.replace('@media ', '')} {
    gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.widescreen;
  }};
  }
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
    theme.fonts[textFamily ?? 'poppins']};
  
  /* 2) Font size from your sizeStyles */
  font-size: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].fontSize;
  }};
  
  /* 3) Font weight */
  font-weight: ${({ theme, textWeight }) =>
    theme.fontWeights[textWeight ?? 'bold']};
  
  /* 4) Font style */
  font-style: ${({ textStyle }) => textStyle ?? 'normal'};
  
  /* 5) Text color (overrides active/inactive defaults) */
  color: ${({ theme, $active, textColor }) =>
    textColor
      ? theme.colors[textColor]
      : $active
        ? theme.colors.white
        : theme.colors.text};
  
  /* Responsive padding */
  padding: ${({ size, horizontalPadding, theme }) => {
    if (horizontalPadding) {
      const vertPadding = getSizeStyles(theme)[size].padding.mobile.split(' ')[0];
      return `${vertPadding} ${horizontalPadding}`;
    }
    return getSizeStyles(theme)[size].padding.mobile;
  }};
  
  /* Responsive width */
  width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.mobile};
  min-width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.mobile};
  
  /* Responsive height */
  height: ${({ size, theme }) => getSizeStyles(theme)[size].height.mobile};
  
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 2px solid
    ${({ $active, theme }) =>
    $active ? theme.colors.black : theme.colors.secondary};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.secondary : 'transparent'};
  cursor: pointer;
  transition:
    transform ${({ theme }) => theme.transitions.medium},
    box-shadow ${({ theme }) => theme.transitions.medium},
    background-color ${({ theme }) => theme.transitions.short},
    color ${({ theme }) => theme.transitions.short};
  
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
  
  /* Tablet responsive styles */
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    padding: ${({ size, horizontalPadding, theme }) => {
    if (horizontalPadding) {
      const vertPadding = getSizeStyles(theme)[size].padding.tablet.split(' ')[0];
      return `${vertPadding} ${horizontalPadding}`;
    }
    return getSizeStyles(theme)[size].padding.tablet;
  }};
    width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.tablet};
    min-width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.tablet};
    height: ${({ size, theme }) => getSizeStyles(theme)[size].height.tablet};
  }
  
  /* Desktop responsive styles */
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    padding: ${({ size, horizontalPadding, theme }) => {
    if (horizontalPadding) {
      const vertPadding = getSizeStyles(theme)[size].padding.desktop.split(' ')[0];
      return `${vertPadding} ${horizontalPadding}`;
    }
    return getSizeStyles(theme)[size].padding.desktop;
  }};
    width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.desktop};
    min-width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.desktop};
    height: ${({ size, theme }) => getSizeStyles(theme)[size].height.desktop};
  }
  
  /* Widescreen responsive styles */
  @media ${({ theme }) => theme.media.widescreen.replace('@media ', '')} {
    padding: ${({ size, horizontalPadding, theme }) => {
    if (horizontalPadding) {
      const vertPadding = getSizeStyles(theme)[size].padding.widescreen.split(' ')[0];
      return `${vertPadding} ${horizontalPadding}`;
    }
    return getSizeStyles(theme)[size].padding.widescreen;
  }};
    width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.widescreen};
    min-width: ${({ widthOverride, size, theme }) =>
    widthOverride ?? getSizeStyles(theme)[size].width.widescreen};
    height: ${({ size, theme }) => getSizeStyles(theme)[size].height.widescreen};
  }
  
  /* Reduced motion preference */
  @media ${({ theme }) => theme.media.reducedMotion.replace('@media ', '')} {
    transition:
      transform ${({ theme }) => theme.transitions.reducedMotion.short},
      box-shadow ${({ theme }) => theme.transitions.reducedMotion.short},
      background-color ${({ theme }) => theme.transitions.reducedMotion.short},
      color ${({ theme }) => theme.transitions.reducedMotion.short};
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
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


const ActionButton = styled.button<{
  actionType: 'submit' | 'reset';
  size: Size;
  textFamily?: FontFamilyKey;
  textWeight?: FontWeightKey;
  textStyle?: 'normal' | 'italic' | 'oblique';
  textColor?: keyof DefaultTheme['colors'];
}>`
  font-family: ${({ theme, textFamily }) =>
    theme.fonts[textFamily ?? 'inter']};
  font-size: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].fontSize;
  }};
  font-weight: ${({ theme, textWeight }) =>
    theme.fontWeights[textWeight ?? 'normal']};
  font-style: ${({ textStyle }) => textStyle ?? 'normal'};
  
  /* Responsive padding */
  padding: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].padding.mobile;
  }};
  
  border-radius: 0;
  border: 2px solid ${({ theme }) => theme.colors.black};
  background: ${({ actionType, theme }) =>
    actionType === 'submit' ? theme.colors.accent : theme.colors.secondary};
  color: ${({ theme, textColor }) =>
    textColor ? theme.colors[textColor] : theme.colors.white};
  
  /* Responsive width and height */
  width: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].width.mobile;
  }};
  height: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].height.mobile;
  }};
  
  opacity: 0.6;
  cursor: pointer;
  transition: opacity ${({ theme }) => theme.transitions.short};
  
  /* Tablet responsive styles */
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    padding: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].padding.tablet;
  }};
    width: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].width.tablet;
  }};
    height: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].height.tablet;
  }};
  }
  
  /* Desktop responsive styles */
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    padding: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].padding.desktop;
  }};
    width: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].width.desktop;
  }};
    height: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].height.desktop;
  }};
  }
  
  /* Widescreen responsive styles */
  @media ${({ theme }) => theme.media.widescreen.replace('@media ', '')} {
    padding: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].padding.widescreen;
  }};
    width: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].width.widescreen;
  }};
    height: ${({ size, theme }) => {
    const styles = getSizeStyles(theme);
    return styles[size].height.widescreen;
  }};
  }
  
  /* Reduced motion preference */
  @media ${({ theme }) => theme.media.reducedMotion.replace('@media ', '')} {
    transition: opacity ${({ theme }) => theme.transitions.reducedMotion.short};
  }
`;
// -------------------------
// ActionList (submit & reset)
// -------------------------
const ActionListContainer = styled.div<{ size: Size; itemGap?: string; }>`
  display: flex;
  flex-direction: column;
  gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.mobile;
  }};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
  
  /* Responsive gap adjustments */
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.tablet;
  }};
  }
  
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.desktop;
  }};
  }
  
  @media ${({ theme }) => theme.media.widescreen.replace('@media ', '')} {
    gap: ${({ size, itemGap, theme }) => {
    if (itemGap) return itemGap;
    const styles = getSizeStyles(theme);
    return styles[size].gap.widescreen;
  }};
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
export function ActionList({
  actions,
  size = 'md',
  itemGap,
  textFamily,
  textWeight,
  textStyle,
  textColor
}: ActionListProps) {
  return (
    <ActionListContainer size={size} itemGap={itemGap}>
      {actions.map((act, idx) => (
        <ActionButton
          key={idx}
          actionType={act.type}
          size={size}
          onClick={act.onClick}
          textFamily={act.textFamily || textFamily}
          textWeight={act.textWeight || textWeight}
          textStyle={act.textStyle || textStyle}
          textColor={act.textColor || textColor}
        >
          {act.label}
        </ActionButton>
      ))}
    </ActionListContainer>
  );
}
export default MenuList;