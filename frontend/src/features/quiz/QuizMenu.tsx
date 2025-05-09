// src/features/quiz/QuizMenu.tsx
import React from 'react';
import MenuLayout from '@components/ui/MenuLayout';
import { BackButton } from '@components/navigation';
import { SectionTitle, SectionSubtitle } from '@components/ui/LayoutPrimitives';
import { MenuList } from '@components/ui/Menu';
import { LinkButton } from '@components/navigation';
import { CircleWrapper } from '@components/components.styles';
import QuizIllustration from '@assets/images/quiz_brain-mouth.png';

export default function QuizMenu() {
  return (
    <MenuLayout>
      <MenuLayout.Left
        flex={1}
        minWidth="300px"
        maxWidth="500px"
        justify="center"
      >
        <BackButton
          to="/"
          style={{
            marginBottom: '1.6rem',
            alignSelf: 'flex-start',
          }}
        />

        <SectionTitle align="left" style={{ marginLeft: '10rem' }}>Test Your Knowledge</SectionTitle>
        <SectionSubtitle align="left">
          Think you've mastered English vowels?<br />
          Let's see what you've got.
        </SectionSubtitle>

        <MenuList
          columns="262px"
          gap="1.6rem"
          justifyItems="end"
          style={{
            marginTop: '1.6rem',
            marginLeft: '3.5rem',
          }}
        >
          <LinkButton to="vowel-shuffle" variant="solid" size="large" active>
            Vowel Shuffle
          </LinkButton>
          <LinkButton to="spell-tell" variant="outline" size="large">
            Spell & Tell
          </LinkButton>
          <LinkButton to="pair-play" variant="outline" size="large">
            Pair Play
          </LinkButton>
          <LinkButton to="phonic-trio" variant="outline" size="large">
            Phonic Trio
          </LinkButton>
        </MenuList>
      </MenuLayout.Left>

      <MenuLayout.Right
        flex={1}
        maxWidth="800px"
        justify="flex-end"
      >
        <CircleWrapper sizePx={550} style={{ marginTop: '3rem' }}>
          <img
            src={QuizIllustration}
            alt="Brain and pencil character illustration"
            style={{ width: '80%' }}
          />
        </CircleWrapper>
      </MenuLayout.Right>
    </MenuLayout>
  );
}
