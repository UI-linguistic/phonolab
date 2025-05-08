// src/features/quiz/PairPlay/PairPlayPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton } from '@components/navigation';

const Container = styled.div`
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.large};
`;

export function PairPlayPage() {
    return (
        <Container>
            <BackButton to="/quiz" />
            <Heading level={2}>Pair Play</Heading>
            <Text>Practice minimal pairs interactively. Content on the way!</Text>
        </Container>
    );
}
