// File: src/components/ui/MenuPresets.tsx
import React from 'react';
import { MenuList, ActionList } from './Menu';

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

const MenuPresets = { SubmitResetGroup, QuizMenuList, LearnMenuList, HomeHeroMenuList };
export default MenuPresets;