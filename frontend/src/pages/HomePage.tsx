import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VowelIllustration from '../images/home_brain-mouth.png';

const BG_COLOR = '#F7D9CB';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 64px); /* Exact header height */
  padding: ${({ theme }) => theme.spacing.medium};
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

const Title = styled.h1`
  font-size: min(2.5rem, 5vh);
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
  margin-bottom: 0.5vh;
`;

const Subtitle = styled.h2`
  font-size: min(1.8rem, 4vh);
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1vh;
`;

const Description = styled.p`
  font-size: min(1.1rem, 2.5vh);
  color: ${({ theme }) => theme.colors.text};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.4;
`;

const IllustrationContainer = styled.div`
  margin: 2vh 0;
  height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-height: 100%;
    width: auto;
    object-fit: contain;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  gap: ${({ theme }) => theme.spacing.large};
  justify-content: center;
  margin-top: 3vh;
`;

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.xlarge};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: min(1.3rem, 3vh);
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.default};
  white-space: nowrap;
  min-width: 220px;

  &:hover {
    background: #d94e0f;
    box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    transform: translateY(-2px);
    opacity: 0.9;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 320px;
`;

const Illustration = styled.img`
  max-width: 420px;
  width: 100%;
  height: auto;
  display: block;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <ContentWrapper>
        <Title>Your Brain Knows English. Let's Get Your Mouth On Board.</Title>
        <Subtitle>Vowel Edition</Subtitle>
        <Description>
          Explore sounds visually, compare them across languages, and finally get those 'ee's and 'ih's sorted.
        </Description>
        <IllustrationContainer>
          <img src={VowelIllustration} alt="Brain and mouth shaking hands" />
        </IllustrationContainer>
        <ButtonContainer>
          <Button onClick={() => navigate('/learn')}>Decode Vowel Sounds</Button>
          <Button onClick={() => navigate('/quiz')}>Put It All Together</Button>
        </ButtonContainer>
      </ContentWrapper>
    </Container>
  );
};

export default HomePage; 