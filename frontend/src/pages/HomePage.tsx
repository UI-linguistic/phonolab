// src/pages/HomePage.tsx
import React from 'react'
import { SectionTitle, SectionSubtitle } from '@components/ui/LayoutPrimitives'
import { LinkButton } from '@components/navigation'
import PageContainer from '@components/ui/PageContainer'
import MenuLayout from '@components/ui/MenuLayout'
import { MenuList } from '@components/ui/Menu'
import { CircleWrapper } from '@components/components.styles'
import HomeIllustration from '@assets/images/home_brain-mouth.png'

export default function HomePage() {
  return (
    <PageContainer>
      <MenuLayout>
        {/* Left column: text + buttons */}
        <MenuLayout.Left
          flex={1}
          minWidth="300px"
          maxWidth="500px"
          justify="center"
        >
          <SectionTitle align="left" style={{ marginLeft: '8rem' }}>
            Start Your Vowel Journey
          </SectionTitle>
          <SectionSubtitle align="left" style={{ marginRight: '10rem' }}>
            Your brain knows English.
            <br />
            Let’s get your mouth on board.
          </SectionSubtitle>

          <MenuList
            columns="300px"
            gap="1.6rem"
            justifyItems="center"
            style={{
              marginTop: '1.6rem',
              marginRight: '4rem'
            }}
          >
            <LinkButton to="/learn" variant="solid" size="large">
              Decode Vowel Sounds
            </LinkButton>
            <LinkButton to="/quiz" variant="outline" size="large">
              Challenge Yourself
            </LinkButton>
          </MenuList>
        </MenuLayout.Left>

        {/* Right column: illustration */}
        <MenuLayout.Right
          flex={1}
          maxWidth="800px"
          justify="center"
        >
          <CircleWrapper sizePx={700}>
            <img
              src={HomeIllustration}
              alt="Brain and mouth"
              style={{ width: '90%' }}
            />
          </CircleWrapper>
        </MenuLayout.Right>
      </MenuLayout>
    </PageContainer>
  )
}
