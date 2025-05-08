// src/features/learn/Vowels101/components/SectionTabs.tsx
import React from 'react';
import { Tabs, Tab } from '../Vowels101.styles';

interface Section { id: number; name: string; slug: string; }
interface Props {
  sections: Section[];
  activeSlug: string;
  onSelect: (slug: string) => void;
}

export const SectionTabs: React.FC<Props> = ({ sections, activeSlug, onSelect }) => (
  <Tabs>
    {sections.map(s => (
      <Tab
        key={s.id}
        active={s.slug === activeSlug}
        onClick={() => onSelect(s.slug)}
      >
        {s.name}
      </Tab>
    ))}
  </Tabs>
);