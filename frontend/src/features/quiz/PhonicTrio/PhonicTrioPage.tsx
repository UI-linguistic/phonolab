// src/features/quiz/PhonicTrio/PhonicTrioPage.tsx
import React from 'react';
import styled from 'styled-components';
import { Heading, Text } from '@components/ui';
import { BackButton } from '@components/navigation';

const Container = styled.div`
  display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.large};
`;

export function PhonicTrioPage() {
    return (
        <Container>
            <BackButton to="/quiz" />
            <Heading level={2}>Phonic Trio</Heading>
            <Text>Select the correct three-letter combination for each vowel. Soon!</Text>
        </Container>
    );
}
