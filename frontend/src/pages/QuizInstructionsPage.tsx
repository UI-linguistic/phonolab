import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #EFD9CE;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', sans-serif;
`;

const BackArrow = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 2rem;
  position: absolute;
  left: 2rem;
  top: 2rem;
  color: #333;
  opacity: 0.6;
  font-family: 'Inter', sans-serif;
  
  &:hover {
    opacity: 1;
  }
`;

const Title = styled.h1`
  font-size: 28px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  color: #000;
  margin: 1rem 0 2rem 0;
  text-align: center;
`;

const InstructionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 900px;
  width: 100%;
`;

const InstructionBox = styled.div`
  border: 5px solid #000;
  background: #EFD9CE;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  font-family: 'Inter', sans-serif;
`;

const TextContainer = styled.div`
  text-align: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.3rem;
`;

const RegularText = styled.span`
  color: #000;
  font-weight: 800;
`;

const HighlightOrange = styled.span`
  color: #FF6B35;
  text-decoration: underline;
  font-weight: 800;
`;

const HighlightTeal = styled.span`
  color: #2A9D8F;
  text-decoration: underline;
  font-weight: 800;
`;

const Underline = styled.span`
  text-decoration: underline;
  font-weight: 700;
`;

const StartButton = styled.button`
  background-color: #FF6B35;
  color: white;
  border: 2px solid #000;
  padding: 0.8rem 2.5rem;
  font-size: 18px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  margin-top: 2rem;
  
  &:hover {
    background-color: #e85d2b;
  }
`;

const QuizInstructionsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <BackArrow onClick={() => navigate('/')}>←</BackArrow>
      <Title>Phonic Trio</Title>
      <InstructionsGrid>
        <InstructionBox>
          <TextContainer>
            <RegularText>You will be shown</RegularText>
            <RegularText>a target</RegularText>
            <HighlightOrange>vowel</HighlightOrange>
            <HighlightOrange>sound</HighlightOrange>
            <RegularText>and</RegularText>
            <Underline>English</Underline>
            <Underline>word</Underline>
            <RegularText>that uses it.</RegularText>
          </TextContainer>
        </InstructionBox>
        <InstructionBox>
          <TextContainer>
            <RegularText>Your task is to</RegularText>
            <RegularText>choose the</RegularText>
            <HighlightTeal>three</HighlightTeal>
            <RegularText>words in other languages</RegularText>
            <RegularText>that use the same vowel</RegularText>
            <Underline>by</Underline>
            <Underline>ear</Underline>
            <RegularText>.</RegularText>
          </TextContainer>
        </InstructionBox>
        <InstructionBox>
          <TextContainer>
            <RegularText>You only</RegularText>
            <RegularText>have</RegularText>
            <HighlightTeal>five</HighlightTeal>
            <HighlightTeal>seconds</HighlightTeal>
            <RegularText>to make a selection, so pay</RegularText>
            <RegularText>careful attention!</RegularText>
          </TextContainer>
        </InstructionBox>
        <InstructionBox>
          <TextContainer>
            <Underline>Turn up</Underline>
            <Underline>your audio</Underline>
            <RegularText>and</RegularText>
            <RegularText>watch</RegularText>
            <RegularText>the</RegularText>
            <HighlightOrange>numbers</HighlightOrange>
            <RegularText>associated with each</RegularText>
            <RegularText>word closely!</RegularText>
          </TextContainer>
        </InstructionBox>
      </InstructionsGrid>
      <StartButton onClick={() => navigate('/quiz/1')}>
        Start
      </StartButton>
    </Container>
  );
};

export default QuizInstructionsPage;