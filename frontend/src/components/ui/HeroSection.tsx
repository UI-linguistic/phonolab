// File: src/components/layout/HeroPresets.tsx
import React, { useState } from 'react';
import styled, { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  TitleContainer,
  SubtitleContainer,
  PageTitle,
  PageSubtitle,
} from '../typography/PageTypography';
import {
  HomeHeroMenuList,
  LearnMenuList,
  QuizMenuList,
} from '../ui/MenuPresets';
import {
  HomePageIllustration,
  LearnMenuIllustration,
  QuizMenuIllustration,
  QuizFeedbackBad,
  QuizFeedbackGood,
} from '../ui/IllustrationWrappers';
import { Size } from '../ui/Menu';

// ────────────────────────────────────────────────────────────
// Generic Hero Layout
// ────────────────────────────────────────────────────────────
const HeroSection = styled.section`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: ${({ theme }) => theme.spacing.xlarge};
  padding: ${({ theme }) => theme.spacing.large} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    row-gap: ${({ theme }) => theme.spacing.large};
  }
`;

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const MediaColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface HeroProps {
  title: string;
  subtitle?: string;
  /**
   * A Menu list component, should accept activeIndex, onSelect, and size props
   */
  menu: React.FC<{ activeIndex?: number; onSelect?: (i: number) => void; size?: Size }>;
  /** Size token (xs | sm | md | lg) */
  menuSize?: Size;
  /** Array of route paths corresponding to each menu item */
  paths?: string[];
  /** Illustration component to render on right side */
  illustration: React.FC;
  /** When true, centers the title above and removes left margin */
  centeredTitle?: boolean;
}

export function HeroTemplate({
  title,
  subtitle,
  menu: MenuComponent,
  menuSize = 'md' as Size,
  paths = [],
  illustration: IllustrationComponent,
  centeredTitle = false,
}: HeroProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <HeroSection>
      <TextColumn style={centeredTitle ? { textAlign: 'center' } : {}}>
        <TitleContainer marginLeft={centeredTitle ? '0' : theme.spacing.small}>
          <PageTitle>{title}</PageTitle>
        </TitleContainer>

        {subtitle && (
          <SubtitleContainer marginLeft={centeredTitle ? '0' : theme.spacing.medium}>
            <PageSubtitle>{subtitle}</PageSubtitle>
          </SubtitleContainer>
        )}

        <MenuComponent
          size={menuSize}
          activeIndex={activeIndex}
          onSelect={(idx: number) => {
            setActiveIndex(idx);
            if (paths[idx]) navigate(paths[idx]);
          }}
        />
      </TextColumn>

      <MediaColumn>
        <IllustrationComponent />
      </MediaColumn>
    </HeroSection>
  );
}

// ────────────────────────────────────────────────────────────
// Variants / Presets
// ────────────────────────────────────────────────────────────

/** 1) Home Page Hero */
export function HomeHero() {
  return (
    <HeroTemplate
      title="Start Your Vowel Journey"
      subtitle="Your brain knows English. Let’s get your mouth on board."
      menu={HomeHeroMenuList}
      menuSize="md"
      paths={["/learn", "/quiz"]}
      illustration={HomePageIllustration}
    />
  );
}

/** 2) Learn Menu Hero */
export function LearnHero() {
  return (
    <HeroTemplate
      title="Choose Your Learning Path"
      subtitle="Master those slippery English vowels that trip up even fluent speakers."
      menu={LearnMenuList}
      menuSize="md"
      paths={[
        "/learn/vowels-101",
        "/learn/map-vowel-space",
        "/learn/graphemes",
        "/learn/tricky-pairs",
      ]}
      illustration={LearnMenuIllustration}
    />
  );
}

/** 3) Quiz Menu Hero */
export function QuizHero() {
  return (
    <HeroTemplate
      title="Test Your Knowledge"
      subtitle="Think you’ve mastered English vowels? Let’s see what you’ve got."
      menu={QuizMenuList}
      menuSize="md"
      paths={[
        "/quiz",
        "/quiz/vowel-shuffle",
        "/quiz/spell-tell",
        "/quiz/pair-play",
        "/quiz/phonic-trio",
      ]}
      illustration={QuizMenuIllustration}
    />
  );
}

/** 4) Quiz Feedback Hero */
export function QuizFeedbackHero({ feedbackType }: { feedbackType: 'good' | 'bad' }) {
  return (
    <HeroTemplate
      title="Quiz Complete"
      subtitle={feedbackType === 'good' ? "Great job!" : "Oops, let’s review your mistakes."}
      menu={() => <></>}              // no menu here
      menuSize="md"
      paths={[]}
      illustration={feedbackType === 'good' ? QuizFeedbackGood : QuizFeedbackBad}
      centeredTitle
    />
  );
}

export default { HomeHero, LearnHero, QuizHero, QuizFeedbackHero, HeroTemplate };
