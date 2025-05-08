// src/features/learn/TrickyPairs/TrickyPairsPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton } from '@components/navigation';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
`;

export function TrickyPairsPage() {
    return (
        <Container>
            <BackButton to="/learn" />
            <Heading level={2}>Tackle Tricky Pairs</Heading>
            <Text>
                Here you’ll practice minimal pairs and get instant feedback.
                Content loading soon!
            </Text>
            {/* TODO: implement useFetchLessons or a dedicated hook for minimal‑pairs data */}
        </Container>
    );
}
