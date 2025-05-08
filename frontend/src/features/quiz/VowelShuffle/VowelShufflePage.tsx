// src/features/quiz/VowelShuffle/VowelShufflePage.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton } from '@components/navigation';

const Container = styled.div`
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.large};
`;

export function VowelShufflePage() {
    return (
        <Container>
            <BackButton to="/quiz" />
            <Heading level={2}>Vowel Shuffle</Heading>
            <Text>This quiz will scramble vowels for you to identify. Stay tuned!</Text>
        </Container>
    );
}
