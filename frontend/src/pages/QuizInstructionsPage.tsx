/*





  Semih & Junho's original design





*/

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
  text-align: center;
`;

const InstructionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem 2.5rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  align-items: stretch;
`;

const InstructionBox = styled.div`
  border: 3px solid #bfae9e;
  border-radius: 16px;
  background: #f7ede6;
  padding: 2.2rem 1.7rem;
  font-size: 1.35rem;
  color: #222;
  min-height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  font-weight: 500;
  box-shadow: 0 4px 18px 0 rgba(180, 150, 120, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  line-height: 1.35;
  letter-spacing: 0.01em;
  &:hover {
    box-shadow: 0 8px 32px 0 rgba(180, 150, 120, 0.18);
    transform: translateY(-2px) scale(1.02);
  }
`;

const HighlightOrange = styled.span`
  color: #f26c23;
  font-weight: 700;
  font-size: 1.1em;
`;
const HighlightTeal = styled.span`
  color: #2a9d9b;
  font-weight: 700;
  font-size: 1.1em;
`;
const Underline = styled.span`
  text-decoration: underline;
  font-weight: 700;
  font-size: 1.1em;
`;

const StartButton = styled.button`
  background-color: #f26c23;
  color: white;
  padding: 1rem 3rem;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  margin: 2.5rem auto 0 auto;
  display: block;
  transition: background 0.2s, transform 0.2s;
  min-width: 200px;
  cursor: pointer;
  &:hover {
    background: #d95b17;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(242, 108, 35, 0.15);
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
        <Title>Phonic Trio - Instructions</Title>
        <InstructionsGrid>
          <InstructionBox>
            You will be shown a target <HighlightOrange>vowel <Underline>sound</Underline></HighlightOrange><br />
            and <Underline>English word</Underline> that uses it.
          </InstructionBox>
          <InstructionBox>
            Your task is to choose the <HighlightTeal>three</HighlightTeal> words in other languages<br />
            that use the same vowel <Underline>by ear</Underline>
          </InstructionBox>
          <InstructionBox>
            You only have <HighlightTeal>five seconds</HighlightTeal> to make a selection,<br />
            so pay close attention!
          </InstructionBox>
          <InstructionBox>
            <Underline>Turn up your audio</Underline> and pay close attention to the <HighlightOrange>numbers</HighlightOrange><br />
            associated with each word!
          </InstructionBox>
        </InstructionsGrid>
        <StartButton onClick={() => navigate('/quiz/1')}>
          Start
        </StartButton>
      </Content>
    </Container>
  );
};

export default QuizInstructionsPage; 