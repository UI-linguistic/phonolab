/**
 * MenuPresets.tsx
 *
 * Pre‑configured, named wrappers around MenuList and ActionList for common UI patterns:
 *
 * 1. SubmitResetGroup
 *    – A two‑button vertical action list for form submit/reset.
 *    – Always uses 'md' size unless overridden.
 *    – Submit: theme.accent background; Reset: theme.secondary background.
 *
 *    Props:
 *      • onSubmit: () ⇒ void    — callback for Submit
 *      • onReset:  () ⇒ void    — callback for Reset
 *      • size?:    Size         — optional size override (xs|sm|md|lg)
 *
 *    Usage:
 *      <SubmitResetGroup onSubmit={…} onReset={…} size="sm" />
 *
 * 2. QuizMenuList
 *    – Vertical menu of four quiz options.
 *    – Default: first item active, size 'md'.
 *
 *    Props:
 *      • activeIndex?: number   — which option is active
 *      • onSelect?:  (i)=>void  — click handler
 *      • size?:       Size      — optional size override
 *
 *    Usage:
 *      <QuizMenuList activeIndex={0} onSelect={…} />
 *
 * 3. LearnMenuList
 *    – Vertical menu of four learning modules.
 *    – Same API as QuizMenuList.
 *
 *    Usage:
 *      <LearnMenuList activeIndex={2} onSelect={…} />
 *
 * 4. HomeHeroMenuList
 *    – Vertical menu with two hero‑page actions.
 *    – Same API, two items only.
 *
 *    Usage:
 *      <HomeHeroMenuList activeIndex={1} onSelect={…} />
 *
 * 5. StartButton
 *    - A single large button for starting a quiz or lesson.
 *    - Uses accent color by default for high visibility.
 *    
 *    Props:
 *      • onClick: () => void    — callback for button click
 *      • size?:   Size          — optional size override (xs|sm|md|lg)
 *      • label?:  string        — optional label text (defaults to "Start")
 *
 *    Usage:
 *      <StartButton onClick={handleStart} />
 *
 * Export:
 *   Default export is an object { SubmitResetGroup, QuizMenuList, LearnMenuList, HomeHeroMenuList }
 *   so you can import presets as:
 *     import MenuPresets from './MenuPresets';
 *     const { QuizMenuList, HomeHeroMenuList } = MenuPresets;
 */

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
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
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

const MenuPresets = { SubmitResetGroup, QuizMenuList, LearnMenuList, HomeHeroMenuList, StartButton };
export default MenuPresets;