// src/features/quiz/SpellTell/SpellTellPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton } from '@components/navigation';

const Container = styled.div`
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.large};
`;

export function SpellTellPage() {
    return (
        <Container>
            <BackButton to="/quiz" />
            <Heading level={2}>Spell & Tell</Heading>
            <Text>Type the spelling of the vowel sound you hear. Coming soon!</Text>
        </Container>
    );
}
