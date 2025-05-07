import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './styles';
import { QuizQuestion as QuizQuestionType, QuizOption } from './types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onNext: () => void;
  onScore: (score: number, maxScore: number) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  onNext,
  onScore 
}) => {
  console.log('QuizQuestion: Component mounted/updated with question:', question.id);

  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(5);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([]);
  const [targetAudio, setTargetAudio] = useState<HTMLAudioElement | null>(null);
  const [optionAudios, setOptionAudios] = useState<{ [key: number]: HTMLAudioElement }>({});
  const [isPlayingIntro, setIsPlayingIntro] = useState(true);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Reset states when question changes
  useEffect(() => {
    console.log('QuizQuestion: Question changed, resetting states for question:', question.id);
    console.log('QuizQuestion: Current state before reset:', {
      timeLeft,
      selectedCards,
      isTimeUp,
      isPlayingIntro,
      currentPlayingIndex,
      hasStarted,
      isAudioLoaded,
      quizOptionsLength: quizOptions.length,
      optionAudiosLength: Object.keys(optionAudios).length
    });

    setTimeLeft(5);
    setSelectedCards([]);
    setIsTimeUp(false);
    setIsPlayingIntro(true);
    setCurrentPlayingIndex(-1);
    setHasStarted(false);
    setIsAudioLoaded(false);
    setQuizOptions([]);
    setOptionAudios({});
    
    // Cleanup previous audio
    if (targetAudio) {
      console.log('QuizQuestion: Cleaning up target audio');
      targetAudio.pause();
      targetAudio.currentTime = 0;
    }
    Object.values(optionAudios).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, [question.id]);

  // Load audio and options
  useEffect(() => {
    console.log('QuizQuestion: Starting audio load for question:', question.id);
    const loadAudio = async () => {
      try {
        // Load target audio
        const audioUrl = question.samples[0].audio.replace('.mp33', '.mp3');
        console.log('QuizQuestion: Loading target audio from:', audioUrl);
        const targetAudioElement = new Audio(audioUrl);
        
        // Add error handling for audio loading
        targetAudioElement.onerror = (e) => {
          console.error('QuizQuestion: Error loading target audio:', e);
          setIsAudioLoaded(true); // Still set loaded to true to allow UI to render
        };

        await new Promise((resolve, reject) => {
          targetAudioElement.addEventListener('canplaythrough', resolve, { once: true });
          targetAudioElement.addEventListener('error', reject, { once: true });
          targetAudioElement.load();
        });
        
        console.log('QuizQuestion: Target audio loaded successfully');
        setTargetAudio(targetAudioElement);
        
        // Prepare options
        const { correct_answers, wrong_answers } = question.options_pool;
        const allOptions: QuizOption[] = [...correct_answers, ...wrong_answers];
        console.log('QuizQuestion: Preparing options:', {
          correctCount: correct_answers.length,
          wrongCount: wrong_answers.length,
          totalOptions: allOptions.length
        });
        
        // Shuffle options
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        
        // Create audio elements
        console.log('QuizQuestion: Creating audio elements for options');
        const audios: { [key: number]: HTMLAudioElement } = {};
        for (let i = 0; i < shuffledOptions.length; i++) {
          const optionAudioUrl = shuffledOptions[i].audio.replace('.mp33', '.mp3');
          const audioElement = new Audio(optionAudioUrl);
          
          // Add error handling for option audio loading
          audioElement.onerror = (e) => {
            console.error('QuizQuestion: Error loading option audio:', e);
          };

          try {
            await new Promise((resolve, reject) => {
              audioElement.addEventListener('canplaythrough', resolve, { once: true });
              audioElement.addEventListener('error', reject, { once: true });
              audioElement.load();
            });
            audios[i] = audioElement;
          } catch (error) {
            console.error('QuizQuestion: Error loading option audio:', error);
            // Continue with other options even if one fails
          }
        }
        
        console.log('QuizQuestion: All option audio loaded successfully');
        setQuizOptions(shuffledOptions);
        setOptionAudios(audios);
        setIsAudioLoaded(true);
        console.log('QuizQuestion: Audio loading complete for question:', question.id);
      } catch (error) {
        console.error('QuizQuestion: Error loading audio for question:', question.id, error);
        setIsAudioLoaded(true); // Set loaded to true even on error to allow UI to render
      }
    };

    loadAudio();

    return () => {
      console.log('QuizQuestion: Cleaning up audio for question:', question.id);
      if (targetAudio) {
        targetAudio.pause();
        targetAudio.currentTime = 0;
      }
      Object.values(optionAudios).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, [question.id]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (hasStarted && !isPlayingIntro && !isTimeUp) {
      console.log('QuizQuestion: Starting timer for question:', question.id);
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            console.log('QuizQuestion: Time up for question:', question.id);
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
        console.log('QuizQuestion: Cleaning up timer for question:', question.id);
        clearInterval(timer);
      }
    };
  }, [isPlayingIntro, isTimeUp, hasStarted, question.id]);

  const playIntroSequence = async () => {
    if (!targetAudio || !isAudioLoaded) {
      console.log('QuizQuestion: Cannot play intro sequence - audio not loaded', {
        hasTargetAudio: !!targetAudio,
        isAudioLoaded
      });
      return;
    }

    try {
      console.log('QuizQuestion: Starting intro sequence for question:', question.id);
      setHasStarted(true);
      // Play target sound
      setCurrentPlayingIndex(-1);
      targetAudio.currentTime = 0;
      await targetAudio.play();
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Play options
      for (let i = 0; i < quizOptions.length; i++) {
        console.log('QuizQuestion: Playing option', i, 'for question:', question.id);
        setCurrentPlayingIndex(i);
        const audioElement = optionAudios[i];
        
        if (audioElement) {
          audioElement.currentTime = 0;
          await audioElement.play();
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      setIsPlayingIntro(false);
      setCurrentPlayingIndex(-1);
      console.log('QuizQuestion: Intro sequence completed for question:', question.id);
    } catch (error) {
      console.error('QuizQuestion: Error playing intro sequence for question:', question.id, error);
      setIsPlayingIntro(false);
    }
  };

  const handleCardClick = (cardId: number) => {
    if (isTimeUp) return;
    
    console.log('QuizQuestion: Card clicked:', cardId, 'for question:', question.id);
    if (optionAudios[cardId]) {
      optionAudios[cardId].currentTime = 0;
      optionAudios[cardId].play();
    }

    setSelectedCards(prev => 
      prev.includes(cardId) 
        ? prev.filter(id => id !== cardId)
        : prev.length < 3 
          ? [...prev, cardId]
          : prev
    );
  };

  const handleTargetAudioPlay = () => {
    console.log('QuizQuestion: Target audio play clicked for question:', question.id);
    if (targetAudio) {
      targetAudio.currentTime = 0;
      targetAudio.play();
    }
  };

  const getScore = () => {
    const score = selectedCards.filter(cardId => 
      question.options_pool.correct_answers.some(
        correct => correct.word === quizOptions[cardId].word
      )
    ).length;
    
    // Report score to parent when time is up
    if (isTimeUp) {
      onScore(score, 3);
    }
    
    return score;
  };

  const progress = ((questionNumber - 1) / (totalQuestions - 1)) * 100;

  console.log('QuizQuestion: Rendering question:', question.id, 'with state:', {
    timeLeft,
    selectedCards,
    isTimeUp,
    isPlayingIntro,
    currentPlayingIndex,
    hasStarted,
    isAudioLoaded,
    quizOptionsLength: quizOptions.length,
    optionAudiosLength: Object.keys(optionAudios).length
  });

  return (
    <S.Container>
      <S.NavigationHeader>
        <S.BackButton onClick={() => navigate('/quiz')}>←</S.BackButton>
        <S.ProgressContainer>
          <S.ProgressBar>
            <S.Progress $progress={progress} />
          </S.ProgressBar>
          <S.ProgressText>{questionNumber}/{totalQuestions}</S.ProgressText>
          {isTimeUp && (
            <S.NextButton onClick={onNext}>
              {questionNumber < totalQuestions ? 'Next Question' : 'See Results'}
            </S.NextButton>
          )}
        </S.ProgressContainer>
      </S.NavigationHeader>
      
      <S.Content>
        <S.TargetSound $isPlaying={currentPlayingIndex === -1}>
          <S.PhoneticText>{question.target}</S.PhoneticText>
          <S.ExampleWord>{question.samples[0].text}</S.ExampleWord>
          <S.AudioButton onClick={handleTargetAudioPlay}>
            🔊
          </S.AudioButton>
        </S.TargetSound>

        {!hasStarted && isAudioLoaded && (
          <S.StartButton onClick={playIntroSequence}>
            Start Question
          </S.StartButton>
        )}

        {hasStarted && !isPlayingIntro && <S.Timer>{timeLeft}</S.Timer>}

        {isAudioLoaded && (
          <S.WordCardsGrid>
            {quizOptions.map((option, index) => (
              <S.WordCard
                key={index}
                $isSelected={selectedCards.includes(index)}
                $isPlaying={currentPlayingIndex === index}
                onClick={() => handleCardClick(index)}
              >
                <div>{option.word}</div>
                <div>{option.language}</div>
                <S.AudioIcon>🔊</S.AudioIcon>
              </S.WordCard>
            ))}
          </S.WordCardsGrid>
        )}

        {isTimeUp && (
          <S.ScoreSummary>
            <S.ScoreTitle>
              Score: {getScore()}/3
            </S.ScoreTitle>
            {selectedCards.map((cardId, index) => {
              const isCorrect = question.options_pool.correct_answers.some(
                correct => correct.word === quizOptions[cardId].word
              );
              return (
                <S.SelectedCard key={index} $isCorrect={isCorrect}>
                  <S.CardInfo>
                    <S.CardWord>{quizOptions[cardId].word}</S.CardWord>
                    <S.CardLanguage>{quizOptions[cardId].language}</S.CardLanguage>
                  </S.CardInfo>
                  <S.ResultIcon $isCorrect={isCorrect}>
                    {isCorrect ? '✓' : '✗'}
                  </S.ResultIcon>
                </S.SelectedCard>
              );
            })}
          </S.ScoreSummary>
        )}
      </S.Content>
    </S.Container>
  );
};

export default QuizQuestion; 