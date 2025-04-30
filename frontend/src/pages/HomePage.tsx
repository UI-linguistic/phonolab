import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VowelIllustration from '../images/home_brain-mouth.png';

const Container = styled.div`
  min-height: calc(100vh - 72px); /* Account for header height */
  background-color: #E8D0C9; /* Darker pale peach background */
  display: flex;
  align-items: center;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 4rem;
  width: 100%;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0; /* Prevent flex item from overflowing */
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #1A1A1A;
  margin: 0;
  margin-bottom: 1rem;
  line-height: 1.1;
`;

const Subtitle = styled.h2`
  font-size: 1.8rem;
  color: #4A4A4A;
  margin: 0;
  margin-bottom: 3rem;
  font-weight: normal;
  line-height: 1.3;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 300px; /* Limit button width */
`;

const PrimaryButton = styled.button`
  background-color: #FF5722; /* Bright orange */
  color: white;
  padding: 1rem 2rem;
  border-radius: 15px; /* Less rounded corners */
  font-size: 1.2rem;
  font-weight: 600;
  border: 3px solid #1A1A1A; /* Thicker border */
  transition: transform 0.2s;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2); /* Subtle shadow */

  &:hover {
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(PrimaryButton)`
  background-color: transparent;
  color: #1A1A1A;
  border: 3px solid #FF5722;
  box-shadow: none; /* Remove shadow for secondary button */
`;

const IllustrationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0; /* Prevent flex item from overflowing */
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <TextContent>
          <Title>Start Your Vowel Journey</Title>
          <Subtitle>Your Brain Knows English. Let's Get Your Mouth On Board.</Subtitle>
          <ButtonContainer>
            <PrimaryButton onClick={() => navigate('/learn')}>
              Decode Vowel Sounds
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate('/quiz')}>
              Challenge Yourself
            </SecondaryButton>
          </ButtonContainer>
        </TextContent>
        <IllustrationContainer>
          <img src={VowelIllustration} alt="Brain and mouth shaking hands" />
        </IllustrationContainer>
      </ContentWrapper>
    </Container>
  );
};

export default HomePage; 