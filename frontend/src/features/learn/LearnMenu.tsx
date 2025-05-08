// src/features/learn/LearnMenu.tsx
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton, LinkButton } from '@components/navigation';
import PageContainer from '@components/ui/PageContainer';
import { MenuList } from '@components/ui/Menu';
import VowelIllustration from '@assets/images/learn_brain-mouth.png';

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
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  max-width: 300px;
  
  @media (max-width: 900px) {
    max-width: 100%; /* Allow full width on mobile */
    margin: 0 auto; /* Center the buttons on mobile */
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
  max-width: 800px; /* Increase to a larger size */
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.colors.text}33`};  /* dark grey @20% */
  border: 2px solid ${({ theme }) => `${theme.colors.black}66`}; /* black @40% */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Illustration = styled.img`
  max-width: 80%;
  height: auto;
  display: block;
`;

export default function LearnMenu() {
  return (
    <PageContainer>
      <BackSection>
        <BackButton to="/learn" />
      </BackSection>

      <HeaderSection>
        <Title>Choose Your Learning Path</Title>
        <SubTitle>
          Master those slippery English vowels<br />
          that trip up even fluent speakers.
        </SubTitle>
      </HeaderSection>

      <BodySection>
        <MenuColumn>
          <StyledMenuList>

            <LinkButton to="vowels-101" variant="solid" size="large" active>
              Vowels 101
            </LinkButton>
            <LinkButton to="map-vowel-space" variant="outline" size="large">
              Map the Vowel Space
            </LinkButton>
            <LinkButton to="graphemes" variant="outline" size="large">
              Get Your Graphemes Right
            </LinkButton>
            <LinkButton to="tricky-pairs" variant="outline" size="large">
              Tackle Tricky Pairs
            </LinkButton>
          </StyledMenuList>
        </MenuColumn>

        <CircleColumn>
          <Circle>
            <Illustration
              src={VowelIllustration}
              alt="Brain and mouth character illustration"
            />
          </Circle>
        </CircleColumn>
      </BodySection>
    </PageContainer>
  );
}
