import React from 'react';
import { useNavigate } from 'react-router-dom';
import { VowelShuffleIntroLayout } from '@components/ui/QuizLayout';
import { StartButton } from '@components/ui/MenuPresets';
import { InstructionBox } from '@components/ui/InstructionBox';
import { Text } from '@components/typography/PageTypography';
import styled from 'styled-components';

// Style for the start button to make it more prominent
const StyledStartButton = styled(StartButton)`
    font-size: 1.25rem;
    padding: 1rem 2.5rem;
    margin-top: 1rem;
`;

export default function VowelShuffleIntroPage() {
    const navigate = useNavigate();

    // Handle start button click - navigate to the main quiz page
    const handleStart = () => {
        navigate('/quiz/vowel-shuffle/play');
    };

    return (
        <VowelShuffleIntroLayout
            title="Vowel Shuffle"
        >
            {/* First child: 2x2 grid of instruction boxes */}
            <>
                <InstructionBox variant="default">
                    <Text variant="instruction" weight="bold">
                        You will be shown the three vowel categories:&nbsp;
                        <Text as="span" variant="instruction" color="secondaryAccent" weight="bold">tongue position</Text>,&nbsp;
                        <Text as="span" variant="instruction" color="secondaryAccent" weight="bold">lip shape</Text>, and&nbsp;
                        <Text as="span" variant="instruction" color="secondaryAccent" weight="bold">length</Text>.
                    </Text>
                </InstructionBox>

                <InstructionBox variant="default">
                    <Text variant="instruction" weight="bold">
                        However, the vowels are all out of order. Your job is to&nbsp;
                        <Text as="span" variant="instruction" weight="bold">sort</Text> the blocks.
                    </Text>
                </InstructionBox>

                <InstructionBox variant="default">
                    <Text variant="instruction" weight="bold">
                        <Text as="span" variant="instruction" color="accent" weight="bold">Drag</Text> the vowel blocks to their correct positions.
                    </Text>
                </InstructionBox>

                <InstructionBox variant="default">
                    <Text variant="instruction" weight="bold">
                        Press <Text as="span" variant="instruction" color="primary" weight="bold">Submit</Text> to check your work.
                    </Text>
                </InstructionBox>
            </>

            {/* Second child: Start button */}
            <StyledStartButton onClick={handleStart} label="Start" />
        </VowelShuffleIntroLayout>
    );
} 