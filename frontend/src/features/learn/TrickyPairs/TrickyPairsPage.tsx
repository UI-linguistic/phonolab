// src/features/learn/TrickyPairs/TrickyPairsPage.tsx
import React, { useState } from 'react';
import { MinimalPairsIntroLayout } from '@components/ui/QuizLayout';
import styled from 'styled-components';
import { Text } from '@components/typography/PageTypography';
import { StartButton } from '@components/ui/MenuPresets';
import { InstructionBox } from '@components/ui/InstructionBox';

// Wrapper for the start button
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2.5rem;
`;

// Enhanced start button with more prominence
const StyledStartButton = styled(StartButton)`
  font-size: 1.25rem;
  padding: 1rem 2.5rem;
`;

// Word card for displaying minimal pairs
const WordCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 2rem;
  background-color: transparent;
  border: 1px solid black;
  border-radius: 4px;
  margin: 0.75rem 0;
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  min-width: 120px;
`;

// Column for displaying word examples
const ExamplesColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem;
  margin: 0 auto;
  max-width: 90%;
`;

export default function TrickyPairsPage() {
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
    };

    if (!started) {
        return (
            <MinimalPairsIntroLayout
                title="Tricky Minimal Pairs"
            >
                {/* Left column - Instructions */}
                <div>
                    <InstructionBox variant="default">
                        <Text variant="instruction" weight="bold">
                            Minimal pairs are two words that
                            differ by only a <Text as="span" weight="bold">single</Text> sound
                            (phoneme) yet have distinct meanings.
                        </Text>
                    </InstructionBox>

                    <ButtonWrapper>
                        <StyledStartButton onClick={handleStart} label="Try your luck?" />
                    </ButtonWrapper>
                </div>

                {/* Right column - Example cards */}
                <ExamplesColumn>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <WordCard style={{ flex: 1, marginRight: '0.5rem' }}>
                            <Text>fill</Text>
                        </WordCard>
                        <WordCard style={{ flex: 1, marginLeft: '0.5rem', backgroundColor: '#333', color: 'white' }}>
                            <Text>feel</Text>
                        </WordCard>
                    </div>

                    <div style={{ display: 'flex', width: '100%' }}>
                        <WordCard style={{ flex: 1, marginRight: '0.5rem' }}>
                            <Text>fit</Text>
                        </WordCard>
                        <WordCard style={{ flex: 1, marginLeft: '0.5rem', backgroundColor: '#333', color: 'white' }}>
                            <Text>feet</Text>
                        </WordCard>
                    </div>
                </ExamplesColumn>
            </MinimalPairsIntroLayout>
        );
    }

    // The actual minimal pairs exercise would go here once started
    return (
        <div>
            <h1>Minimal Pairs Exercise</h1>
            <p>The actual exercise content would go here</p>
            <button onClick={() => setStarted(false)}>Back to instructions</button>
        </div>
    );
}
