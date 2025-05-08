// src/features/learn/MapVowelSpace/MapVowelSpacePage.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton } from '@components/navigation';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
`;

export function MapVowelSpacePage() {
    return (
        <Container>
            <BackButton to="/learn" />
            <Heading level={2}>Map the Vowel Space</Heading>
            <Text>
                This lesson will show you how each vowel sits in the phonetic space.
                We’ll fetch the coordinates and plot them here soon.
            </Text>
            {/* TODO: use a hook to fetch and render vowel‑space data */}
        </Container>
    );
}
