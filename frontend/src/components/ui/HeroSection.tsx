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

type HeroSectionProps = {
  /** choose one of theme.heroGaps keys */
  gapScale?: keyof import('../../styles/theme').HeroGaps;
  /** override maximum width, defaults to full container */
  maxWidth?: string;
};

// ────────────────────────────────────────────────────────────
// Generic Hero Layout
// ────────────────────────────────────────────────────────────
export const HeroSection = styled.section<HeroSectionProps>`
  outline: 2px dashed rgba(207, 48, 42, 0.6);
  max-width: ${({ maxWidth = '100%' }) => maxWidth};
  margin: 0 auto;

  display: grid;
  /* two columns, left gets 1.2fr, right 1fr for extra space on text */
  grid-template-columns: 1.2fr 1fr;
  column-gap: ${({ theme, gapScale = 'normal' }) => theme.heroGaps[gapScale]};
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

interface HeroProps extends HeroSectionProps {
  title: string;
  subtitle?: string;
  menu: React.FC<{ activeIndex?: number; onSelect?: (i: number) => void; size?: Size }>;
  menuSize?: Size;
  paths?: string[];
  illustration: React.FC;
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
  gapScale = 'normal',
  maxWidth,
}: HeroProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <HeroSection gapScale={gapScale} maxWidth={maxWidth}>
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

export function HomeHero(props: HeroSectionProps) {
  return (
    <HeroTemplate
      title="Start Your Vowel Journey"
      subtitle="Your brain knows English. Let's get your mouth on board."
      menu={HomeHeroMenuList}
      menuSize="md"
      paths={['/learn', '/quiz']}
      illustration={HomePageIllustration}
      {...props}
    />
  );
}

export function LearnHero(props: HeroSectionProps) {
  return (
    <HeroTemplate
      title="Choose Your Learning Path"
      subtitle="Master those slippery English vowels that trip up even fluent speakers."
      menu={LearnMenuList}
      menuSize="md"
      paths={[
        '/learn/vowels-101',
        '/learn/map-vowel-space',
        '/learn/graphemes',
        '/learn/tricky-pairs',
      ]}
      illustration={LearnMenuIllustration}
      {...props}
    />
  );
}

export function QuizHero(props: HeroSectionProps) {
  return (
    <HeroTemplate
      title="Test Your Knowledge"
      subtitle="Think you've mastered English vowels? Let's see what you've got."
      menu={QuizMenuList}
      menuSize="md"
      paths={[
        '/quiz',
        '/quiz/vowel-shuffle',
        '/quiz/spell-tell',
        '/quiz/pair-play',
        '/quiz/phonic-trio',
      ]}
      illustration={QuizMenuIllustration}
      {...props}
    />
  );
}

export function QuizFeedbackHero({ feedbackType }: { feedbackType: 'good' | 'bad' }) {
  return (
    <HeroTemplate
      title="Quiz Complete"
      subtitle={
        feedbackType === 'good'
          ? 'Great job!'
          : "Oops, let's review your mistakes."
      }
      menu={() => <></>}
      menuSize="md"
      paths={[]}
      illustration={
        feedbackType === 'good' ? QuizFeedbackGood : QuizFeedbackBad
      }
      centeredTitle
      gapScale="normal"
      maxWidth="1200px"
    />
  );
}

export default { HomeHero, LearnHero, QuizHero, QuizFeedbackHero, HeroTemplate };
