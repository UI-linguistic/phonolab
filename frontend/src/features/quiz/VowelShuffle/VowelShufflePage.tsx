// src/features/quiz/VowelShuffle/VowelShufflePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// 1) Outer container, centered column
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
`;

// 2) Back arrow / button
const Back = styled.button`
  background: none;
  border: none;
  font-size: 2.5rem;
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

// 3) Centered content area
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

// 4) Page title
const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  text-align: center;
`;

// 5) 2×2 grid for instructions
const InstructionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => `${theme.spacing.xlarge} ${theme.spacing.large}`};
  width: 100%;
  max-width: 900px;
  align-items: stretch;
`;

// 6) Individual instruction “card”
const InstructionBox = styled.div`
  border: 3px solid ${({ theme }) => theme.colors.black};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => `${theme.spacing.xlarge} ${theme.spacing.large}`};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.text};
  min-height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  font-weight: 500;
  box-shadow: ${({ theme }) => theme.shadows.low};
  transition: box-shadow 0.2s, transform 0.2s;
  line-height: 1.4;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.high};
    transform: translateY(-2px) scale(1.02);
  }
`;

// 7) Highlight & underline spans
const HighlightAccent = styled.span`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 700;
`;
const HighlightPrimary = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 700;
`;
const Underline = styled.span`
  text-decoration: underline;
  font-weight: 700;
`;

// 8) Start button
const StartButton = styled.button`
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => `${theme.spacing.large} ${theme.spacing.xlarge}`};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 600;
  border: none;
  margin: ${({ theme }) => theme.spacing.xlarge} auto 0;
  display: block;
  min-width: 200px;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s, box-shadow 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.high};
  }
  &:active {
    transform: translateY(0);
  }
`;

export default function QuizInstructionsPage() {
    const navigate = useNavigate();

    return (
        <Container>
            <Back onClick={() => navigate(-1)}>←</Back>
            <Content>
                <Title>Vowel Shuffle</Title>

                <InstructionsGrid>
                    <InstructionBox>
                        You will be shown the three vowel categories:&nbsp;
                        <HighlightPrimary>tongue position</HighlightPrimary>,&nbsp;
                        <HighlightAccent>lip shape</HighlightAccent>, and&nbsp;
                        <HighlightPrimary>length</HighlightPrimary>.
                    </InstructionBox>

                    <InstructionBox>
                        However, the vowels are all out of order. Your job is to{' '}
                        <Underline>sort</Underline> the blocks into the correct order.
                    </InstructionBox>

                    <InstructionBox>
                        <Underline>Drag</Underline> the vowel blocks to their correct positions.
                    </InstructionBox>

                    <InstructionBox>
                        Press <HighlightPrimary>Submit</HighlightPrimary> to check your work.
                    </InstructionBox>
                </InstructionsGrid>

                <StartButton onClick={() => navigate('/quiz/shuffle')}>
                    Start
                </StartButton>
            </Content>
        </Container>
    );
}
