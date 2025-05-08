// src/pages/HomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { LinkButton } from '@components/navigation';
import PageContainer from '@components/ui/PageContainer';
import VowelIllustration from '@assets/images/home_brain-mouth.png';

const FullHeight = styled.div`
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: ${({ theme }) => theme.spacing.xlarge};
`;

const MainContent = styled.div`
   display: flex;
   align-items: flex-start;
   padding-top: 2rem;
   justify-content: center;
   gap: 4vw;
   width: 100%;
   @media (max-width: 900px) {
     flex-direction: column;
     gap: ${({ theme }) => theme.spacing.large};
   }
 `;

const Left = styled.div`
  flex: 1;
  min-width: 350px;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};

  max-width: 400px;
  width: 100%;
`;

const StyledLinkButton = styled(LinkButton)`
  svg {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
  }
  width: 100%;
`;

const Right = styled.div`
  flex: 1;
  min-width: 320px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* lift it up a bit to mirror LearnMenu */
  margin-top: 0;

  @media (max-width: 900px) {
    margin-top: 0;
  }
`;

// The “circle” wrapper
const Circle = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;               /* match your illustration max-width */
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: ${({ theme }) => `${theme.colors.text}33`};  /* 20% grey */
  border: 2px solid ${({ theme }) => `${theme.colors.black}66`}; /* 40% black */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Illustration = styled.img`
  display: block;
  width: 90%;      /* slightly smaller to sit inside the circle */
  height: auto;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <FullHeight>
        <MainContent>
          <Left>
            <Heading level={1}>Start Your Vowel Journey</Heading>
            <Text as="p" size="large">
              Your brain knows English.
              <br />
              Let’s get your mouth on board.
            </Text>

            <ButtonStack>
              <StyledLinkButton to="/learn" variant="solid" size="large" active={true}>
                Decode Vowel Sounds
              </StyledLinkButton>
              <StyledLinkButton to="/quiz" variant="outline" size="large">
                Challenge Yourself
              </StyledLinkButton>
            </ButtonStack>
          </Left>

          <Right>
            <Circle>
              <Illustration
                src={VowelIllustration}
                alt="Illustration of mouth and brain shaking hands"
              />
            </Circle>
          </Right>
        </MainContent>
      </FullHeight>
    </PageContainer>
  );
};

export default HomePage;
