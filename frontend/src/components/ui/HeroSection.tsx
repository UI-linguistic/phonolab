/**
 * HeroSection.tsx
 *
 * Defines a responsive two‑column Hero layout with text on the left and illustration on the right.
 * Includes four named presets for Home, LearnMenu, QuizMenu, and QuizFeedback pages.
 *
 * Features:
 *  - CSS Grid 1.2fr / 1fr split for text vs. media
 *  - Configurable `gapScale` (theme.heroGaps: tight/normal/wide) drives both:
 *     • `column-gap` between columns
 *     • horizontal padding on container edges
 *  - Optional `maxWidth` prop to cap overall width and center via margin: auto
 *  - Vertical padding via theme.spacing.large
 *  - Tablet breakpoint switches to single‑column with row‑gap
 *  - Debug outline and labels when debug mode is enabled
 *
 * HeroTemplate Props:
 *  • title          string                                   — main heading text
 *  • subtitle?      string                                   — optional subheading
 *  • menu           React.FC<{ activeIndex?, onSelect?, size? }> — a Menu component
 *  • menuSize?      'xs' | 'sm' | 'md' | 'lg'                — sizing token for menu buttons
 *  • paths?         string[]                                 — client‑side routes for each menu item
 *  • illustration   React.FC                                 — any Illustration preset component
 *  • centeredTitle? boolean                                  — center title & subtitle above grid
 *  • gapScale?      keyof theme.heroGaps                     — controls gutter & padding
 *  • maxWidth?      string                                   — override container max‑width
 *
 * Presets:
 *  • HomeHero        – 2‑item menu, plain illustration
 *  • LearnHero       – 4‑item menu, circled illustration
 *  • QuizHero        – 4‑item menu, circled illustration
 *  • QuizFeedbackHero– no menu, centered title, feedback illustration
 *
 * Usage:
 *  import { HomeHero } from './HeroSection';
 *  <HomeHero gapScale="normal" maxWidth="85ch" />
 */

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

// Debug label component for showing component names in debug mode
const DebugLabel = styled.div<{ enabled: boolean; position: string }>`
  display: ${({ enabled }) => (enabled ? 'block' : 'none')};
  position: absolute;
  ${({ position }) => {
    switch (position) {
      case 'top-right':
        return 'top: 0; right: 0;';
      case 'bottom-left':
        return 'bottom: 0; left: 0;';
      case 'bottom-right':
        return 'bottom: 0; right: 0;';
      case 'top-left':
      default:
        return 'top: 0; left: 0;';
    }
  }}
  font-size: ${({ theme }) => theme.debug?.labels?.fontSize || '10px'};
  background: ${({ theme }) => theme.debug?.labels?.background || 'rgba(0, 0, 0, 0.7)'};
  color: ${({ theme }) => theme.debug?.labels?.color || 'white'};
  padding: ${({ theme }) => theme.debug?.labels?.padding || '2px 4px'};
  border-radius: ${({ theme }) => theme.debug?.labels?.borderRadius || '2px'};
  z-index: ${({ theme }) => theme.debug?.zIndex || 9999};
  pointer-events: none;
`;

type HeroSectionProps = {
  /** choose one of theme.heroGaps keys */
  $gapScale?: keyof import('../../styles/theme').HeroGaps;
  /** override maximum width, defaults to full container */
  $maxWidth?: string;
};

// ────────────────────────────────────────────────────────────
// Generic Hero Layout
// ────────────────────────────────────────────────────────────
export const HeroSection = styled.section<HeroSectionProps>`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.component
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  max-width: ${({ $maxWidth = '100%' }) => $maxWidth};
  margin: 0 auto;
  display: grid;
  /* Make grid more content-adaptive */
  grid-template-columns: minmax(auto, 1.1fr) minmax(auto, 1fr);
  column-gap: ${({ theme, $gapScale = 'normal' }) => theme.heroGaps[$gapScale]};
  padding: ${({ theme }) => theme.spacing.large} 0;
  
  /* Responsive adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    row-gap: ${({ theme }) => theme.spacing.large};
  }
  
  /* Additional mobile adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.medium} 0;
  }
`;

const TextColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  position: relative; /* For debug label positioning */
  
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.component
      : 'none'
  };
  
  /* Responsive adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.small};
  }
`;

const MediaColumn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* For debug label positioning */
  
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.component
      : 'none'
  };
  
  /* Responsive adjustments for illustrations */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    /* Scale down illustrations on mobile */
    svg {
      max-width: 100%;
      height: auto;
      transform: scale(0.9);
    }
  }
`;

interface HeroProps extends Omit<HeroSectionProps, '$gapScale' | '$maxWidth'> {
  title: string;
  subtitle?: React.ReactNode;
  columnRatio?: string;
  menu: React.FC<{ activeIndex?: number; onSelect?: (i: number) => void; size?: Size }>;
  menuSize?: Size;
  paths?: string[];
  illustration: React.FC;
  centeredTitle?: boolean;
  gapScale?: keyof import('../../styles/theme').HeroGaps;
  maxWidth?: string;
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
  columnRatio = '1.4fr 1fr',
}: HeroProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Debug settings
  const debugEnabled = theme.debug?.enabled && theme.debug?.labels?.enabled;
  const labelPosition = theme.debug?.labels?.position || 'top-left';

  return (
    <HeroSection $gapScale={gapScale} $maxWidth={maxWidth}>
      {debugEnabled && (
        <DebugLabel enabled={debugEnabled} position={labelPosition}>
          HeroSection
        </DebugLabel>
      )}

      <TextColumn style={centeredTitle ? { textAlign: 'center' } : {}}>
        {debugEnabled && (
          <DebugLabel enabled={debugEnabled} position={labelPosition}>
            TextColumn
          </DebugLabel>
        )}

        <TitleContainer style={{
          marginLeft: centeredTitle ? '0' : theme.spacing.small,
          /* Responsive title adjustments */
          fontSize: `clamp(${theme.fontSizes.xl}, 5vw, ${theme.fontSizes.xxl})`,
        }}>
          <PageTitle variant="heroTitle">{title}</PageTitle>
        </TitleContainer>

        {subtitle && (
          <SubtitleContainer style={{
            marginLeft: centeredTitle ? '0' : theme.spacing.medium,
            /* Responsive subtitle adjustments */
            fontSize: `clamp(${theme.fontSizes.md}, 3vw, ${theme.fontSizes.lg})`,
          }}>
            <PageSubtitle variant="heroSubtitle" color="textSubtle">{subtitle}</PageSubtitle>
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
        {debugEnabled && (
          <DebugLabel enabled={debugEnabled} position={labelPosition}>
            MediaColumn
          </DebugLabel>
        )}
        <IllustrationComponent />
      </MediaColumn>
    </HeroSection>
  );
}

// ────────────────────────────────────────────────────────────
// Variants / Presets
// ────────────────────────────────────────────────────────────
export function HomeHero(props: Omit<HeroProps, 'title' | 'subtitle' | 'menu' | 'illustration'>) {
  return (
    <HeroTemplate
      title="Start Your Vowel Journey"
      subtitle={
        <>
          Your brain knows English.<br />
          Let's get your mouth on board.
        </>
      }
      menu={HomeHeroMenuList}
      menuSize="md"
      paths={['/learn', '/quiz']}
      illustration={HomePageIllustration}
      {...props}
    />
  );
}

export function LearnHero(props: Omit<HeroProps, 'title' | 'subtitle' | 'menu' | 'illustration'>) {
  return (
    <HeroTemplate
      title="Choose Your Learning Path"
      subtitle={
        <>
          Master those slippery English vowels<br /> that
          trip up even fluent speakers.
        </>
      }
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

export function QuizHero(props: Omit<HeroProps, 'title' | 'subtitle' | 'menu' | 'illustration'>) {
  return (
    <HeroTemplate
      title="Test Your Knowledge"
      subtitle="Think you've mastered English vowels? Let's see what you've got."
      menu={QuizMenuList}
      menuSize="md"
      paths={[
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

export function QuizFeedbackHero({
  feedbackType,
  ...props
}: {
  feedbackType: 'good' | 'bad'
} & Omit<HeroProps, 'title' | 'subtitle' | 'menu' | 'illustration'>) {
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
      {...props}
    />
  );
}

export default { HomeHero, LearnHero, QuizHero, QuizFeedbackHero, HeroTemplate };
