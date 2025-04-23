import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xlarge};
`;

const QuizPage: React.FC = () => {
  const { questionId } = useParams<{ questionId: string }>();

  return (
    <Container>
      <h1>Quiz Page - Question {questionId}</h1>
      <p>This page will be implemented in the next phase.</p>
    </Container>
  );
};

export default QuizPage; 