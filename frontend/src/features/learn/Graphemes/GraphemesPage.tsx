// src/features/learn/Graphemes/GraphemesPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton } from '@components/navigation';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
`;

export function GraphemesPage() {
    return (
        <Container>
            <BackButton to="/learn" />
            <Heading level={2}> Get Your Graphemes Right </Heading>
            <Text>
                This lesson is coming soon! Here you’ll learn which graphemes map
                to each vowel sound.Stay tuned.
            </Text>
            {/* TODO: fetch and render graphemes data via useLessons or a dedicated hook */}
        </Container>
    );
}
