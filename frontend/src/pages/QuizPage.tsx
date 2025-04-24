import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const BackButton = styled.button`
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
`;

const Timer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xlarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
`;

const TargetSound = styled.div<{ $isPlaying?: boolean }>`
  background-color: ${({ theme, $isPlaying }) => 
    $isPlaying ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $isPlaying }) => 
    $isPlaying ? 'white' : theme.colors.text};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  box-shadow: ${({ $isPlaying }) => $isPlaying ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
  min-width: 300px;
  flex-shrink: 0;
  transition: all 0.3s ease;
  transform: ${({ $isPlaying }) => $isPlaying ? 'scale(1.05)' : 'none'};
`;

const PhoneticText = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const ExampleWord = styled.div`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const AudioButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.default};
  padding: ${({ theme }) => theme.spacing.small};
  border-radius: 50%;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const WordCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.large};
  flex: 0 1 500px;
  max-width: 500px;
`;

const WordCard = styled.button<{ $isSelected?: boolean; $isPlaying?: boolean }>`
  aspect-ratio: 1;
  background-color: ${({ theme, $isSelected, $isPlaying }) => 
    $isPlaying ? theme.colors.primary :
    $isSelected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $isSelected, $isPlaying }) => 
    $isPlaying || $isSelected ? 'white' : theme.colors.text};
  border: 2px solid ${({ theme, $isSelected, $isPlaying }) => 
    $isPlaying ? theme.colors.primary :
    $isSelected ? theme.colors.primary : theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  transform: ${({ $isPlaying }) => $isPlaying ? 'scale(1.05)' : 'none'};
  box-shadow: ${({ $isPlaying }) => $isPlaying ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const AudioIcon = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  font-size: 1.2rem;
  opacity: 0.7;
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

const NextButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 0.9rem;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  margin-left: ${({ theme }) => theme.spacing.medium};

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const FeedbackMessage = styled.div<{ $isCorrect?: boolean }>`
  color: ${({ theme, $isCorrect }) => $isCorrect ? theme.colors.success : theme.colors.error};
  font-size: 1.2rem;
  margin-top: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

const AudioIntroOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
`;

const CurrentlyPlaying = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

const PlaybackProgress = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: ${({ theme }) => theme.spacing.medium};
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.1s linear;
`;

const ScoreSummary = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: ${({ theme }) => theme.spacing.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const ScoreTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

const SelectedCard = styled.div<{ $isCorrect: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme, $isCorrect }) => 
    $isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const CardInfo = styled.div`
  flex: 1;
`;

const CardWord = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
`;

const CardLanguage = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;

const ResultIcon = styled.div<{ $isCorrect: boolean }>`
  font-size: 1.5rem;
  color: ${({ $isCorrect }) => $isCorrect ? '#4CAF50' : '#F44336'};
`;

interface QuizSample {
  text: string;
  IPA: string;
  audio: string;
}

interface QuizOption {
  language: string;
  word: string;
  IPA: string;
  audio: string;
}

interface QuizQuestion {
  id: number;
  target: string;
  samples: QuizSample[];
  options_pool: {
    correct_answers: QuizOption[];
    wrong_answers: QuizOption[];
  };
  feedback: {
    correct: string;
    incorrect: string;
  };
}

interface QuizData {
  settings: {
    syllable_count: number;
    options_per_question: number;
    questions_per_phoneme: number;
  };
  quiz: QuizQuestion[];
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId: string }>();
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [targetAudio, setTargetAudio] = useState<HTMLAudioElement | null>(null);
  const [optionAudios, setOptionAudios] = useState<{ [key: number]: HTMLAudioElement }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlayingIntro, setIsPlayingIntro] = useState(true);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const response = await fetch('/temporary-jsons/quiz.json');
        const data: QuizData = await response.json();
        const question = data.quiz.find(q => q.id === Number(questionId));
        if (question) {
          setCurrentQuestion(question);
          
          // Load target audio
          const targetAudioElement = new Audio(question.samples[0].audio);
          await new Promise((resolve) => {
            targetAudioElement.addEventListener('canplaythrough', resolve, { once: true });
            targetAudioElement.load();
          });
          setTargetAudio(targetAudioElement);
          
          // Prepare options in correct order
          const correctOptions = question.options_pool.correct_answers;
          const wrongOptions = question.options_pool.wrong_answers;
          
          // Load audio for correct options first
          const audios: { [key: number]: HTMLAudioElement } = {};
          const allOptions: QuizOption[] = [];
          
          // Load correct options
          for (let i = 0; i < correctOptions.length; i++) {
            const audioElement = new Audio(correctOptions[i].audio);
            await new Promise((resolve) => {
              audioElement.addEventListener('canplaythrough', resolve, { once: true });
              audioElement.load();
            });
            audios[i] = audioElement;
            allOptions.push(correctOptions[i]);
          }
          
          // Load wrong options
          for (let i = 0; i < wrongOptions.length; i++) {
            const audioElement = new Audio(wrongOptions[i].audio);
            await new Promise((resolve) => {
              audioElement.addEventListener('canplaythrough', resolve, { once: true });
              audioElement.load();
            });
            audios[correctOptions.length + i] = audioElement;
            allOptions.push(wrongOptions[i]);
          }
          
          // Shuffle the options array while maintaining audio correspondence
          const shuffledIndices = Array.from({ length: allOptions.length }, (_, i) => i)
            .sort(() => Math.random() - 0.5);
          
          const shuffledOptions = shuffledIndices.map(i => allOptions[i]);
          const shuffledAudios = shuffledIndices.reduce((acc, newIndex, oldIndex) => {
            acc[newIndex] = audios[oldIndex];
            return acc;
          }, {} as { [key: number]: HTMLAudioElement });
          
          setQuizOptions(shuffledOptions);
          setOptionAudios(shuffledAudios);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading audio:', error);
      }
    };

    loadAudio();
  }, [questionId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (!isPlayingIntro && !isTimeUp) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setIsTimeUp(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isPlayingIntro, isTimeUp]);

  useEffect(() => {
    if (!isLoading && isPlayingIntro) {
      playIntroSequence();
    }
  }, [isLoading, isPlayingIntro]);

  const playIntroSequence = async () => {
    try {
      // Play target sound first
      setCurrentPlayingIndex(-1);
      setIsPlaying(true);
      if (targetAudio) {
        targetAudio.currentTime = 0;
        await targetAudio.play();
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Play each option sound in the order they appear in the UI
      for (let i = 0; i < quizOptions.length; i++) {
        setCurrentPlayingIndex(i);
        setIsPlaying(true);
        const currentOption = quizOptions[i];
        const audioElement = optionAudios[i];
        
        if (audioElement) {
          audioElement.currentTime = 0;
          await audioElement.play();
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      setIsPlayingIntro(false);
      setIsPlaying(false);
      setCurrentPlayingIndex(-1);
    } catch (error) {
      console.error('Error playing intro sequence:', error);
    }
  };

  const handleCardClick = (cardId: number) => {
    if (isTimeUp) return;
    
    // Play the audio
    if (optionAudios[cardId]) {
      optionAudios[cardId].currentTime = 0;
      optionAudios[cardId].play().catch(error => {
        console.error('Error playing option audio:', error);
      });
    }

    // Handle selection
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handleTargetAudioPlay = () => {
    if (targetAudio) {
      targetAudio.currentTime = 0;
      targetAudio.play().catch(error => {
        console.error('Error playing target audio:', error);
      });
    }
  };

  const handleOptionAudioPlay = (cardId: number) => {
    if (optionAudios[cardId]) {
      optionAudios[cardId].currentTime = 0;
      optionAudios[cardId].play().catch(error => {
        console.error('Error playing option audio:', error);
      });
    }
  };

  const handleNext = () => {
    const nextId = Number(questionId) + 1;
    if (nextId <= 12) {
      navigate(`/quiz/${nextId}`);
    } else {
      navigate('/quiz/result');
    }
  };

  const handleSubmit = () => {
    const correctAnswers = selectedCards.filter(cardId => 
      currentQuestion?.options_pool.correct_answers.some(
        correct => correct.word === quizOptions[cardId].word
      )
    ).length;

    setIsCorrect(correctAnswers === 3);
    setShowFeedback(true);
    setIsTimeUp(true);
  };

  const getSelectedCardsInfo = () => {
    return selectedCards.map(cardId => ({
      word: quizOptions[cardId].word,
      language: quizOptions[cardId].language,
      isCorrect: currentQuestion?.options_pool.correct_answers.some(
        correct => correct.word === quizOptions[cardId].word
      )
    }));
  };

  const getScore = () => {
    return selectedCards.filter(cardId => 
      currentQuestion?.options_pool.correct_answers.some(
        correct => correct.word === quizOptions[cardId].word
      )
    ).length;
  };

  if (isLoading) {
    return <Container>Loading audio...</Container>;
  }

  if (!currentQuestion || !quizOptions.length) {
    return <Container>Loading...</Container>;
  }

  const progress = ((Number(questionId) - 1) / 11) * 100;

  return (
    <Container>
      <NavigationHeader>
        <BackButton onClick={() => navigate('/quiz')}>←</BackButton>
        <ProgressContainer>
          <ProgressBar>
            <Progress $progress={progress} />
          </ProgressBar>
          <ProgressText>{questionId}/12</ProgressText>
          {isTimeUp && (
            <NextButton onClick={handleNext}>
              {Number(questionId) < 12 ? 'Next Question' : 'See Results'}
            </NextButton>
          )}
        </ProgressContainer>
        {!isPlayingIntro && <Timer>{timeLeft}</Timer>}
      </NavigationHeader>
      
      <Content>
        <TargetSound $isPlaying={currentPlayingIndex === -1}>
          <PhoneticText>{currentQuestion.target}</PhoneticText>
          <ExampleWord>{currentQuestion.samples[0].text}</ExampleWord>
          <AudioButton onClick={handleTargetAudioPlay}>
            🔊
          </AudioButton>
        </TargetSound>

        <WordCardsGrid>
          {quizOptions.map((option, index) => (
            <WordCard
              key={index}
              $isSelected={selectedCards.includes(index)}
              $isPlaying={currentPlayingIndex === index}
              onClick={() => handleCardClick(index)}
            >
              <div>{option.word}</div>
              <div>{option.language}</div>
              <AudioIcon>🔊</AudioIcon>
            </WordCard>
          ))}
        </WordCardsGrid>

        {isTimeUp && (
          <ScoreSummary>
            <ScoreTitle>
              Score: {getScore()}/3
            </ScoreTitle>
            {getSelectedCardsInfo().map((card, index) => (
              <SelectedCard key={index} $isCorrect={card.isCorrect}>
                <CardInfo>
                  <CardWord>{card.word}</CardWord>
                  <CardLanguage>{card.language}</CardLanguage>
                </CardInfo>
                <ResultIcon $isCorrect={card.isCorrect}>
                  {card.isCorrect ? '✓' : '✗'}
                </ResultIcon>
              </SelectedCard>
            ))}
          </ScoreSummary>
        )}

        {showFeedback && (
          <FeedbackMessage $isCorrect={isCorrect}>
            {isCorrect ? currentQuestion.feedback.correct : currentQuestion.feedback.incorrect}
          </FeedbackMessage>
        )}
      </Content>
    </Container>
  );
};

export default QuizPage; 