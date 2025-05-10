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
 * Export:
 *   Default export is an object { SubmitResetGroup, QuizMenuList, LearnMenuList, HomeHeroMenuList }
 *   so you can import presets as:
 *     import MenuPresets from './MenuPresets';
 *     const { QuizMenuList, HomeHeroMenuList } = MenuPresets;
 */

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