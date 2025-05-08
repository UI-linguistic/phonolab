// src/features/quiz/QuizMenu.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton, LinkButton } from '@components/navigation';
import PageContainer from '@components/ui/PageContainer';
import { MenuList } from '@components/ui/Menu';
import QuizIllustration from '@assets/images/quiz_brain-mouth.png';

const BackSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const HeaderSection = styled.header`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const Title = styled(Heading).attrs({ level: 1 })`
  white-space: nowrap;
`;

const SubTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 1.125rem;
  line-height: 1.4;
`;

const BodySection = styled.section`
  display: flex;
  align-items: flex-start;
  column-gap: ${({ theme }) => theme.spacing.large};

  @media (max-width: 900px) {
    flex-direction: column;
    column-gap: 0;
    row-gap: ${({ theme }) => theme.spacing.large};
  }
`;

const MenuColumn = styled.div`
  flex: 1;
  padding: 0 ${({ theme }) => theme.spacing.small};
  margin-left: -${({ theme }) => theme.spacing.small};

  @media (max-width: 900px) {
    margin-left: 0;
    text-align: center;
  }
`;

const StyledMenuList = styled(MenuList)`
  width:300px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  max-width: 300px;

  @media (max-width: 900px) {
    max-width: 100%;
    margin: 0 auto;
  }
`;

const CircleColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: -140px;

  @media (max-width: 900px) {
    margin-top: 0;
  }
`;

const Circle = styled.div`
  position: relative;
  width: 100%;
  max-width: 800px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.colors.text}33`};
  border: 2px solid ${({ theme }) => `${theme.colors.black}66`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Illustration = styled.img`
  max-width: 80%;
  height: auto;
  display: block;
`;

export default function QuizMenu() {
  return (
    <PageContainer>
      <BackSection>
        <BackButton to="/quiz" />
      </BackSection>

      <HeaderSection>
        <Title>Test Your Knowledge</Title>
        <SubTitle>
          Think you’ve mastered English vowels?<br />
          Let’s see what you’ve got.
        </SubTitle>
      </HeaderSection>

      <BodySection>
        <MenuColumn>
          <StyledMenuList>
            <LinkButton to="shuffle" variant="solid" size="large" active>
              Vowel Shuffle
            </LinkButton>
            <LinkButton to="spell-tell" variant="outline" size="large">
              Spell &amp; Tell
            </LinkButton>
            <LinkButton to="pair-play" variant="outline" size="large">
              Pair Play
            </LinkButton>
            <LinkButton to="phonic-trio" variant="outline" size="large">
              Phonic Trio
            </LinkButton>
          </StyledMenuList>
        </MenuColumn>

        <CircleColumn>
          <Circle>
            <Illustration
              src={QuizIllustration}
              alt="Brain and mouth quiz illustration"
            />
          </Circle>
        </CircleColumn>
      </BodySection>
    </PageContainer>
  );
}
