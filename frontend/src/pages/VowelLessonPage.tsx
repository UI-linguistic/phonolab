import React, { useState, useEffect } from 'react';
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

const ProgressBar = styled.div`
  width: 200px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 6px;
  overflow: hidden;
  margin: 0 ${({ theme }) => theme.spacing.large};
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Progress = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary} 0%,
    ${({ theme }) => theme.colors.secondary} 100%
  );
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 100%
    );
    animation: shimmer 2s infinite;
  }
`;

const ProgressText = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.background};
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const keyframes = {
  shimmer: `
    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `
};

const HomeButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

interface VowelLesson {
  id: number;
  target: string;
  audio_url: string;
  mouth_image_url: string;
  pronounced: string;
  common_spellings: string[];
  lips: string;
  tongue: string;
  example_words: string[];
}

interface VowelLessonsData {
  learn: VowelLesson[];
}

const VowelLessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [currentLesson, setCurrentLesson] = useState<VowelLesson | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const response = await fetch('/temporary-jsons/vowel-lesson.json');
        const data: VowelLessonsData = await response.json();
        const lesson = data.learn.find(l => l.id === Number(lessonId));
        if (lesson) {
          setCurrentLesson(lesson);
          setAudio(new Audio(lesson.audio_url));
        }
      } catch (error) {
        console.error('Error fetching lesson data:', error);
      }
    };

    fetchLessonData();
  }, [lessonId]);

  const handlePrevious = () => {
    const prevId = Number(lessonId) - 1;
    if (prevId >= 1) {
      navigate(`/learn/vowels-101/${prevId}`);
    }
  };

  const handleNext = () => {
    const nextId = Number(lessonId) + 1;
    if (nextId <= 12) {
      navigate(`/learn/vowels-101/${nextId}`);
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handlePlayAudio = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const progress = ((Number(lessonId) - 1) / 11) * 100; // 11 because we have 12 lessons (0-11)

  if (!currentLesson) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <NavigationHeader>
        <NavButton onClick={handlePrevious} disabled={lessonId === '1'}>←</NavButton>
        <Title>Vowel {currentLesson.id}: {currentLesson.target}</Title>
        <ProgressContainer>
          <ProgressBar>
            <Progress $progress={progress} />
          </ProgressBar>
          <ProgressText>{currentLesson.id}/12</ProgressText>
        </ProgressContainer>
        {lessonId === '12' ? (
          <HomeButton onClick={handleHome}>Back to Home</HomeButton>
        ) : (
          <NavButton onClick={handleNext}>→</NavButton>
        )}
      </NavigationHeader>

      <ContentContainer>
        <IllustrationContainer>
          <img src={currentLesson.mouth_image_url} alt="Mouth position for vowel" />
        </IllustrationContainer>

        <InfoBox>
          <InfoItem>Pronounced: "{currentLesson.pronounced}"</InfoItem>
          <InfoItem>Common Spellings: {currentLesson.common_spellings.join(', ')}</InfoItem>
          <InfoItem>Lips: {currentLesson.lips}</InfoItem>
          <InfoItem>Tongue: {currentLesson.tongue}</InfoItem>
          <InfoItem>Example Words: {currentLesson.example_words.join(', ')}</InfoItem>
          <AudioContainer>
            <PlayButton onClick={handlePlayAudio}>🔊</PlayButton>
            <PhoneticText>{currentLesson.target}</PhoneticText>
          </AudioContainer>
        </InfoBox>
      </ContentContainer>
    </Container>
  );
};

export default VowelLessonPage; 