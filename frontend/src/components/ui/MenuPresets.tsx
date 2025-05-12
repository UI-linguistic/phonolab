import React from 'react';
import { MenuList, ActionList } from './Menu';
import styled from 'styled-components';

// ────────────────────────────────────────────────────────────
// 1) SubmitResetGroup
//    Always medium size, vertical stack, accent/secondary.
// ────────────────────────────────────────────────────────────
export function SubmitResetGroup(props: {
  onSubmit: () => void;
  onReset: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const { onSubmit, onReset, size = 'md' } = props;
  return (
    <ActionList
      size={size}
      actions={[
        { label: 'Submit', type: 'submit', onClick: onSubmit },
        { label: 'Reset', type: 'reset', onClick: onReset },
      ]}
    />
  );
}

// ────────────────────────────────────────────────────────────
// 2) QuizMenuList
//    Vertical, medium, first item active by default.
// ────────────────────────────────────────────────────────────
export function QuizMenuList(props: {
  activeIndex?: number;
  onSelect?: (i: number) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const { activeIndex = 0, onSelect, size = 'md' } = props;
  return (
    <MenuList
      items={['Vowel Shuffle', 'Spell & Tell', 'Pair Play', 'Phonic Trio']}
      orientation="vertical"
      size={size}
      activeIndex={activeIndex}
      onSelect={onSelect}
    />
  );
}

// ────────────────────────────────────────────────────────────
// 3) LearnMenuList
//    Vertical, medium, first item active by default.
// ────────────────────────────────────────────────────────────
export function LearnMenuList(props: {
  activeIndex?: number;
  onSelect?: (i: number) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const { activeIndex = 0, onSelect, size = 'md' } = props;
  return (
    <MenuList
      items={[
        'Vowels 101',
        'Map the Vowel Space',
        'Get Your Graphemes Right',
        'Tackle Tricky Pairs',
      ]}
      orientation="vertical"
      size={size}
      activeIndex={activeIndex}
      onSelect={onSelect}
    />
  );
}

// ────────────────────────────────────────────────────────────
// 4) HomeHeroMenuList
//    Two‑item vertical menu used in the Hero on HomePage.
// ────────────────────────────────────────────────────────────
export function HomeHeroMenuList(props: {
  activeIndex?: number;
  onSelect?: (i: number) => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}) {
  const { activeIndex = 0, onSelect, size = 'md' } = props;
  return (
    <MenuList
      items={['Decode Vowel Sounds', 'Challenge Yourself']}
      orientation="vertical"
      size={size}
      activeIndex={activeIndex}
      onSelect={onSelect}
    />
  );
}

// ────────────────────────────────────────────────────────────
// 5) StartButton 
//    Single prominent button for starting activities
// ────────────────────────────────────────────────────────────
const StyledStartButton = styled.button<{ size?: 'xs' | 'sm' | 'md' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.accent};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  font-weight: bold;
  transition: 
    background-color ${({ theme }) => theme.transitions.short}, 
    transform ${({ theme }) => theme.transitions.short};
  min-width: 150px;
  
  /* Size variants */
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'xs': return `${theme.spacing.xsmall} ${theme.spacing.small}`;
      case 'sm': return `${theme.spacing.small} ${theme.spacing.medium}`;
      case 'lg': return `${theme.spacing.medium} ${theme.spacing.large}`;
      case 'md':
      default: return `${theme.spacing.medium} ${theme.spacing.medium}`;
    }
  }};
  
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'xs': return theme.fontSizes.sm;
      case 'sm': return theme.fontSizes.md;
      case 'lg': return theme.fontSizes.xl;
      case 'md':
      default: return theme.fontSizes.lg;
    }
  }};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.accent ? `${theme.colors.accent}dd` : theme.colors.accent};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.grey || '#cccccc'};
    cursor: not-allowed;
    transform: none;
  }
  
  /* Responsive adjustments */
  @media ${({ theme }) => theme.media.mobile.replace('@media ', '')} {
    min-width: 120px;
  }
  
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    min-width: 150px;
  }
  
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    min-width: 180px;
  }
  
  @media ${({ theme }) => theme.media.widescreen.replace('@media ', '')} {
    min-width: 200px;
  }
  
  /* Reduced motion preference */
  @media ${({ theme }) => theme.media.reducedMotion.replace('@media ', '')} {
    transition: 
      background-color ${({ theme }) => theme.transitions.reducedMotion.short}, 
      transform ${({ theme }) => theme.transitions.reducedMotion.short};
    &:hover {
      transform: none;
    }
  }
`;

export function StartButton(props: {
  onClick: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  disabled?: boolean;
}) {
  const { onClick, size = 'lg', label = 'Start', disabled = false } = props;
  return (
    <StyledStartButton
      onClick={onClick}
      size={size}
      disabled={disabled}
    >
      {label}
    </StyledStartButton>
  );
}

// ────────────────────────────────────────────────────────────
// 6) TonguePositionButtonGroup 
//    Custom styling for Vowel Shuffle quiz
// ────────────────────────────────────────────────────────────
const TonguePositionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3rem;
  width: 100%;
  max-width: 170px;
  height: 100%;
  padding: 0;
  margin: 0;
  
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    max-width: 200px;
    gap: 3.5rem;
  }
  
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    max-width: 220px;
    gap: 4rem;
  }
`;

const SubmitButton = styled.button`
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0.75rem 1.25rem;
  min-width: 170px;
  width: 100%;
  height: 50px;
  background-color: #71B2AD; /* Teal color from the image */
  color: white;
  border: 2px solid black;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    min-width: 200px;
    font-size: 1.35rem;
    height: 55px;
  }
  
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    min-width: 220px;
    font-size: 1.5rem;
    height: 60px;
  }
  @media ${({ theme }) => theme.media.reducedMotion.replace('@media ', '')} {
    transition: all ${({ theme }) => theme.transitions.reducedMotion.short};
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

const ResetButton = styled.button`
  font-size: 1.25rem;
  font-weight: bold;
  padding: 0.75rem 1.25rem;
  min-width: 170px;
  width: 100%;
  height: 50px;
  background-color: #EF9277; /* Salmon color from the image */
  color: white;
  border: 2px solid black;
  border-radius: 4px;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.medium};
  margin: 0;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  @media ${({ theme }) => theme.media.tablet.replace('@media ', '')} {
    min-width: 200px;
    font-size: 1.35rem;
    height: 55px;
  }
  
  @media ${({ theme }) => theme.media.desktop.replace('@media ', '')} {
    min-width: 220px;
    font-size: 1.5rem;
    height: 60px;
  }
  
  @media ${({ theme }) => theme.media.reducedMotion.replace('@media ', '')} {
    transition: all ${({ theme }) => theme.transitions.reducedMotion.short};
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;


export function TonguePositionButtonGroup(props: {
  onSubmit: () => void;
  onReset: () => void;
}) {
  const { onSubmit, onReset } = props;
  return (
    <TonguePositionWrapper>
      <SubmitButton onClick={onSubmit}>Submit</SubmitButton>
      <ResetButton onClick={onReset}>Reset</ResetButton>
    </TonguePositionWrapper>
  );
}

const MenuPresets = {
  SubmitResetGroup,
  QuizMenuList,
  LearnMenuList,
  HomeHeroMenuList,
  StartButton,
  TonguePositionButtonGroup
};

export default MenuPresets;
