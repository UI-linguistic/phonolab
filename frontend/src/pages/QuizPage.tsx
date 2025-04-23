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

const TargetSound = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 300px;
  flex-shrink: 0;
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

const WordCard = styled.button<{ $isSelected?: boolean }>`
  aspect-ratio: 1;
  background-color: ${({ theme, $isSelected }) => 
    $isSelected ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $isSelected }) => 
    $isSelected ? 'white' : theme.colors.text};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};
  position: relative;
  overflow: hidden;

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

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId: string }>();
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    if (isTimeUp) {
      // You can customize what happens when time is up
      alert("Time's up!");
      // Optionally navigate to results or next question
      // navigate('/results');
    }
  }, [isTimeUp, navigate]);

  const handleCardClick = (cardNumber: number) => {
    if (isTimeUp) return; // Prevent card selection after time is up
    if (selectedCards.includes(cardNumber)) {
      setSelectedCards(selectedCards.filter(num => num !== cardNumber));
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, cardNumber]);
    }
  };

  const handleAudioPlay = (audioSource: string) => {
    // Implement audio playback logic
    console.log('Playing audio:', audioSource);
  };

  return (
    <Container>
      <NavigationHeader>
        <BackButton onClick={() => navigate('/quiz')}>←</BackButton>
        <Timer>{timeLeft}</Timer>
      </NavigationHeader>
      
      <Content>
        <TargetSound>
          <PhoneticText>/i/</PhoneticText>
          <ExampleWord>see</ExampleWord>
          <AudioButton onClick={() => handleAudioPlay('target-sound.mp3')}>
            🔊
          </AudioButton>
        </TargetSound>

        <WordCardsGrid>
          {[1, 2, 3, 4].map(number => (
            <WordCard
              key={number}
              $isSelected={selectedCards.includes(number)}
              onClick={() => handleCardClick(number)}
            >
              {number}
              <AudioIcon>🔊</AudioIcon>
            </WordCard>
          ))}
        </WordCardsGrid>
      </Content>
    </Container>
  );
};

export default QuizPage; 