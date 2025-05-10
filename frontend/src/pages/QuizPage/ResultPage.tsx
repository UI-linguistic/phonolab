import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as S from './styles';

interface QuestionScore {
  questionId: number;
  score: number;
  maxScore: number;
  target: string;
}

const ResultPage: React.FC = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<QuestionScore[]>([]);

  useEffect(() => {
    const storedScores = localStorage.getItem('quizScores');
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  const totalScore = scores.reduce((sum, q) => sum + q.score, 0);
  const maxPossibleScore = scores.reduce((sum, q) => sum + q.maxScore, 0);
  const percentage = (totalScore / maxPossibleScore) * 100;

  return (
    <S.Container>
      <S.NavigationHeader>
        <S.BackButton onClick={() => navigate('/quiz')}>←</S.BackButton>
        <S.ProgressContainer>
          <S.ProgressText>Quiz Results</S.ProgressText>
        </S.ProgressContainer>
      </S.NavigationHeader>

      <S.Content>
        <S.ResultSummary>
          <S.ScoreTitle>Final Score</S.ScoreTitle>
          <S.FinalScore>
            {totalScore}/{maxPossibleScore}
          </S.FinalScore>
          <S.PercentageScore>
            {percentage.toFixed(1)}%
          </S.PercentageScore>
        </S.ResultSummary>

        <S.QuestionResults>
          {scores.map((questionScore) => (
            <S.QuestionResult key={questionScore.questionId}>
              <S.QuestionInfo>
                <S.QuestionNumber>Question {questionScore.questionId}</S.QuestionNumber>
                <S.QuestionTarget>Target: {questionScore.target}</S.QuestionTarget>
              </S.QuestionInfo>
              <S.QuestionScore>
                {questionScore.score}/{questionScore.maxScore}
              </S.QuestionScore>
            </S.QuestionResult>
          ))}
        </S.QuestionResults>

        <S.ActionButtons>
          <S.RestartButton onClick={() => navigate('/quiz/1')}>
            Try Again
          </S.RestartButton>
          <S.HomeButton onClick={() => navigate('/')}>
            Back to Home
          </S.HomeButton>
        </S.ActionButtons>
      </S.Content>
    </S.Container>
  );
};

export default ResultPage; 