import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import pronounMouthArt from '../images/PNG/pronounmouthart-01.png';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
`;

const NavigationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const NavButton = styled.button`
  background: none;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.6;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xlarge};
  flex: 1;
  padding: ${({ theme }) => theme.spacing.xlarge} 0;
`;

const IllustrationContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    max-width: 500px;
    height: auto;
  }
`;

const InfoBox = styled.div`
  background-color: #FF4444;
  color: white;
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 400px;
  
  > * + * {
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
`;

const InfoItem = styled.div`
  font-size: 1.2rem;
  line-height: 1.5;
`;

const AudioContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.large};
  justify-content: center;
`;

const PhoneticText = styled.span`
  font-size: 2rem;
  font-family: serif;
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: white;
  
  &:hover {
    opacity: 0.8;
  }
`;

// Mock data for lesson 1
const MOCK_LESSON_1 = {
  id: 1,
  title: 'Vowel 1: Long E',
  pronunciation: 'ee',
  commonSpellings: 'ee, ea',
  lipPosition: 'wide smile, unrounded',
  tonguePosition: 'high, front',
  exampleWords: 'see, beat, team',
  phoneticSymbol: '/iː/'
};

const VowelLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const currentLesson = MOCK_LESSON_1; // This would come from an API call
  const [audio] = useState(new Audio('/temporary-mp3/1-i_close_front_unrounded_vowel.mp3'));

  const handlePrevious = () => {
    const prevId = Number(lessonId) - 1;
    if (prevId >= 1) {
      navigate(`/learn/vowels-101/${prevId}`);
    }
  };

  const handleNext = () => {
    const nextId = Number(lessonId) + 1;
    if (nextId <= 12) { // Assuming 12 lessons total
      navigate(`/learn/vowels-101/${nextId}`);
    }
  };

  const handlePlayAudio = () => {
    audio.currentTime = 0; // Reset audio to start
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  return (
    <Container>
      <NavigationHeader>
        <NavButton onClick={handlePrevious} disabled={lessonId === '1'}>←</NavButton>
        <Title>{currentLesson.title}</Title>
        <NavButton onClick={handleNext} disabled={lessonId === '12'}>→</NavButton>
      </NavigationHeader>

      <ContentContainer>
        <IllustrationContainer>
          <img src={pronounMouthArt} alt="Mouth position for vowel" />
        </IllustrationContainer>

        <InfoBox>
          <InfoItem>Pronounced: "{currentLesson.pronunciation}"</InfoItem>
          <InfoItem>Common Spellings: {currentLesson.commonSpellings}</InfoItem>
          <InfoItem>Lips: {currentLesson.lipPosition}</InfoItem>
          <InfoItem>Tongue: {currentLesson.tonguePosition}</InfoItem>
          <InfoItem>Example Words: {currentLesson.exampleWords}</InfoItem>
          <AudioContainer>
            <PlayButton onClick={handlePlayAudio}>🔊</PlayButton>
            <PhoneticText>{currentLesson.phoneticSymbol}</PhoneticText>
          </AudioContainer>
        </InfoBox>
      </ContentContainer>
    </Container>
  );
};

export default VowelLessonPage; 