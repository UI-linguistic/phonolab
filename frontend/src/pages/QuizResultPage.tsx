import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xlarge};
`;

const QuizResultPage: React.FC = () => {
  return (
    <Container>
      <h1>Quiz Results</h1>
      <p>This page will be implemented in the next phase.</p>
    </Container>
  );
};

export default QuizResultPage; 