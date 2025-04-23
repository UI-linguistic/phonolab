import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
  transition: ${({ theme }) => theme.transitions.default};
  align-self: flex-start;
  padding: 0;
  margin-bottom: ${({ theme }) => theme.spacing.large};

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  gap: ${({ theme }) => theme.spacing.xlarge};
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  width: 100%;
  text-align: left;
`;

const InstructionItem = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};

  strong {
    font-weight: 600;
  }
`;

const Bullet = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.small};
`;

const StartButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.xlarge};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.5rem;
  font-weight: 600;
  transition: ${({ theme }) => theme.transitions.default};
  margin-top: ${({ theme }) => theme.spacing.xlarge};
  min-width: 200px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const QuizInstructionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <BackButton onClick={() => navigate('/')}>←</BackButton>
      <Content>
        <Title>Instructions:</Title>
        <InstructionsList>
          <InstructionItem>
            <Bullet>-</Bullet>
            You will be presented with a target vowel sound and English word.
          </InstructionItem>
          <InstructionItem>
            <Bullet>-</Bullet>
            Choose <strong>three</strong> words in other languages that have the same vowel.
          </InstructionItem>
          <InstructionItem>
            <Bullet>-</Bullet>
            You have only <strong>five</strong> seconds to make a selection, so pay close attention.
          </InstructionItem>
          <InstructionItem>
            <Bullet>-</Bullet>
            For the demo, please keep track of the card <strong>numbers</strong> you choose.
          </InstructionItem>
          <InstructionItem>
            <Bullet>-</Bullet>
            Audio is <strong>required</strong> to complete the quiz. Please turn up your volume.
          </InstructionItem>
        </InstructionsList>
        <StartButton onClick={() => navigate('/quiz/1')}>
          Start
        </StartButton>
      </Content>
    </Container>
  );
};

export default QuizInstructionsPage; 