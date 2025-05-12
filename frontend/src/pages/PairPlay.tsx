import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #F7D9CB;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Message = styled.h1`
  font-size: 2.2rem;
  color: #23243a;
  font-weight: 700;
`;

const PairPlay: React.FC = () => (
  <Container>
    <Message>This page will be implemented soon</Message>
  </Container>
);

export default PairPlay; 