import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 64px);
  padding: ${({ theme }) => theme.spacing.large};
  display: flex;
  flex-direction: column;
`;

export const NavigationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

export const BackButton = styled.button`
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

export const Timer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 4px solid ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin: ${({ theme }) => theme.spacing.large} 0;
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xlarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
`;

export const TargetSound = styled.div<{ $isPlaying?: boolean }>`
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

export const PhoneticText = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const ExampleWord = styled.div`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const AudioButton = styled.button`
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

export const WordCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.large};
  flex: 0 1 500px;
  max-width: 500px;
`;

export const WordCard = styled.button<{ $isSelected?: boolean; $isPlaying?: boolean }>`
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

export const AudioIcon = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  font-size: 1.2rem;
  opacity: 0.7;
`;

export const ProgressBar = styled.div`
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

export const Progress = styled.div<{ $progress: number }>`
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

export const ProgressText = styled.span`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  font-weight: 500;
  background: ${({ theme }) => theme.colors.background};
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
`;

export const NextButton = styled.button`
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

export const FeedbackMessage = styled.div<{ $isCorrect?: boolean }>`
  color: ${({ theme, $isCorrect }) => $isCorrect ? '#4CAF50' : '#F44336'};
  font-size: 1.2rem;
  margin-top: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

export const AudioIntroOverlay = styled.div`
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

export const CurrentlyPlaying = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

export const PlaybackProgress = styled.div`
  width: 300px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: ${({ theme }) => theme.spacing.medium};
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => $progress}%;
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.1s linear;
`;

export const ScoreSummary = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: ${({ theme }) => theme.spacing.large};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const ScoreTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

export const SelectedCard = styled.div<{ $isCorrect: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ $isCorrect }) => 
    $isCorrect ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const CardInfo = styled.div`
  flex: 1;
`;

export const CardWord = styled.div`
  font-size: 1.2rem;
  font-weight: 500;
`;

export const CardLanguage = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
`;

export const ResultIcon = styled.div<{ $isCorrect: boolean }>`
  font-size: 1.5rem;
  color: ${({ $isCorrect }) => $isCorrect ? '#4CAF50' : '#F44336'};
`;

export const StartButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 15px 30px;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 20px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #45a049;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

export const ResultSummary = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FinalScore = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 1rem 0;
`;

export const PercentageScore = styled.div`
  font-size: 1.5rem;
  color: #7f8c8d;
`;

export const QuestionResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const QuestionResult = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const QuestionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const QuestionNumber = styled.div`
  font-weight: bold;
  color: #2c3e50;
`;

export const QuestionTarget = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

export const QuestionScore = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

export const RestartButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2980b9;
  }
`;

export const HomeButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: #95a5a6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #7f8c8d;
  }
`;

export const Card = styled.div<{
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  isTimeUp: boolean;
  isPlaying?: boolean;
}>`
  aspect-ratio: 1;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: ${props => props.isPlaying ? 'scale(1.05)' : 'none'};
  box-shadow: ${props => props.isPlaying ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)'};

  ${props => props.isSelected && `
    background: #3498db;
    color: white;
  `}

  ${props => props.isTimeUp && props.isCorrect && `
    background: #2ecc71;
    color: white;
  `}

  ${props => props.isTimeUp && props.isWrong && `
    background: #e74c3c;
    color: white;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const CardNumber = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
`; 