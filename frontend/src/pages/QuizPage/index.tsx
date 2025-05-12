import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestion from './QuizQuestion';
import { QuizData } from './types';

interface QuestionScore {
  questionId: number;
  score: number;
  maxScore: number;
  target: string;
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { questionId } = useParams<{ questionId: string }>();
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scores, setScores] = useState<QuestionScore[]>([]);

  useEffect(() => {
    console.log('QuizPage: Current questionId:', questionId);
  }, [questionId]);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        console.log('QuizPage: Starting to load quiz data');
        setIsLoading(true);
        const response = await fetch('/temporary-jsons/quiz.json');
        if (!response.ok) {
          throw new Error('Failed to load quiz data');
        }
        const data: QuizData = await response.json();
        console.log('QuizPage: Quiz data loaded successfully, total questions:', data.quiz.length);
        setQuizData(data);
      } catch (error) {
        console.error('QuizPage: Error loading quiz data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizData();
  }, []);

  const handleScore = (score: number, maxScore: number) => {
    const currentQuestion = quizData?.quiz.find(q => q.id === Number(questionId));
    if (!currentQuestion) return;

    setScores(prev => {
      const newScores = [...prev];
      const existingScoreIndex = newScores.findIndex(s => s.questionId === currentQuestion.id);
      
      const scoreData: QuestionScore = {
        questionId: currentQuestion.id,
        score,
        maxScore,
        target: currentQuestion.target
      };

      if (existingScoreIndex >= 0) {
        newScores[existingScoreIndex] = scoreData;
      } else {
        newScores.push(scoreData);
      }

      return newScores;
    });
  };

  const handleNext = () => {
    const nextId = Number(questionId) + 1;
    console.log('QuizPage: Moving to next question, current:', questionId, 'next:', nextId);
    
    // Only navigate to results if we've completed all questions
    if (nextId > 12) {
      console.log('QuizPage: All questions completed, navigating to results');
      // Store scores in localStorage before navigating to results
      localStorage.setItem('quizScores', JSON.stringify(scores));
      navigate('/quiz/result');
    } else {
      console.log('QuizPage: Moving to next question:', nextId);
      navigate(`/quiz/${nextId}`);
    }
  };

  if (isLoading || !quizData) {
    console.log('QuizPage: Still loading quiz data');
    return <div>Loading quiz data...</div>;
  }

  const currentQuestion = quizData.quiz.find(q => q.id === Number(questionId));
  
  if (!currentQuestion) {
    console.error('QuizPage: Question not found for id:', questionId);
    return <div>Question not found</div>;
  }

  console.log('QuizPage: Rendering question:', currentQuestion.id, 'with data:', {
    target: currentQuestion.target,
    samples: currentQuestion.samples.length,
    options: currentQuestion.options_pool.correct_answers.length + currentQuestion.options_pool.wrong_answers.length
  });

  return (
    <QuizQuestion
      key={questionId}
      question={currentQuestion}
      questionNumber={Number(questionId)}
      totalQuestions={quizData.quiz.length}
      onNext={handleNext}
      onScore={handleScore}
    />
  );
};

export default QuizPage; 