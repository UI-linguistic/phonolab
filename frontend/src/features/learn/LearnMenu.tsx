import React from 'react';
import MenuLayout from '@components/ui/MenuLayout';
import { BackButton } from '@components/navigation';
import { SectionTitle, SectionSubtitle } from '@components/ui/LayoutPrimitives';
import { MenuList } from '@components/ui/Menu';
import { LinkButton } from '@components/navigation';
import { CircleWrapper } from '@components/components.styles';
import VowelIllustration from '@assets/images/learn_brain-mouth.png';

export default function LearnMenu() {
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

        <SectionTitle align="left" style={{ marginLeft: '10rem' }}>
          Choose Your Learning Path
        </SectionTitle>
        <SectionSubtitle align="left">
          Master those slippery English vowels<br />
          that trip up even fluent speakers.
        </SectionSubtitle>

        <MenuList
          columns="262px"
          gap="1.6rem"
          justifyItems="end"
          style={{
            marginTop: '1.6rem',
            marginLeft: '3.5rem'
          }}
        >
          <LinkButton to="vowels-101" variant="solid" size="large" active>
            Vowels 101
          </LinkButton>
          <LinkButton to="map-vowel-space" variant="outline" size="large">
            Map the Vowel Space
          </LinkButton>
          <LinkButton to="graphemes" variant="outline" size="large">
            Get Your Graphemes Right
          </LinkButton>
          <LinkButton to="tricky-pairs" variant="outline" size="large">
            Tackle Tricky Pairs
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
            src={VowelIllustration}
            alt="Brain and mouth character illustration"
            style={{ width: '80%' }}
          />
        </CircleWrapper>
      </MenuLayout.Right>
    </MenuLayout>
  );
}
