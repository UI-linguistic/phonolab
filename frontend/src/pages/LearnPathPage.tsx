import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LearnIllustration from '../images/learn_brain-mouth.png';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xlarge};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.small};
  margin-right: ${({ theme }) => theme.spacing.large};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xlarge};
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.spacing.xlarge};
`;

const IllustrationContainer = styled.div`
  flex: 1;
  max-width: 400px;
  img {
    width: 100%;
    height: auto;
  }
`;

const LearningPathsContainer = styled.div`
  flex: 1;
`;

const PathTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const PathGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.large};
`;

const PathButton = styled.button`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.2rem;
  font-weight: 500;
  text-align: center;
  transition: ${({ theme }) => theme.transitions.default};
  height: 100%;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LearnPathPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/')}>←</BackButton>
        <Title>Sound School</Title>
      </Header>
      
      <ContentWrapper>
        <IllustrationContainer>
          <img src={LearnIllustration} alt="Brain with headphones" />
        </IllustrationContainer>
        
        <LearningPathsContainer>
          <PathTitle>Choose Your Learning Path</PathTitle>
          <PathGrid>
            <PathButton onClick={() => navigate('/learn/vowels-101/1')}>
              Vowels 101
            </PathButton>
            <PathButton onClick={() => navigate('/learn/map-vowel-space')}>
              Map the Vowel Space
            </PathButton>
            <PathButton onClick={() => navigate('/learn/mouth-right')}>
              Get Your Mouth Right
            </PathButton>
            <PathButton onClick={() => navigate('/learn/tricky-pairs')}>
              Tackle Tricky Pairs
            </PathButton>
          </PathGrid>
        </LearningPathsContainer>
      </ContentWrapper>
    </Container>
  );
};

export default LearnPathPage; 