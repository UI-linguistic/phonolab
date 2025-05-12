import React, { useState, useEffect } from 'react';
import { Box, Paper, Stack } from '@mantine/core';
import { ConfigurableGrid } from '@components/display/ConfigurableGrid';
import GridQuizService, { GridQuizState } from './GridService';
import tonguePositionData from '@api/fallback/tongue-position.json';
import MenuPresets from '@components/ui/MenuPresets';
import styled from 'styled-components';
import { Text, PhonemeGridText } from '@components/typography/PageTypography';
import theme from '@styles/theme';

// Mock vowel data for demo purposes
const mockVowels = [
    { id: 1, ipa: 'i', audio_url: '' },
    { id: 2, ipa: 'ɪ', audio_url: '' },
    { id: 3, ipa: 'e', audio_url: '' },
    { id: 4, ipa: 'ɛ', audio_url: '' },
    { id: 5, ipa: 'æ', audio_url: '' },
    { id: 6, ipa: 'ʌ', audio_url: '' },
    { id: 7, ipa: 'ə', audio_url: '' },
    { id: 8, ipa: 'ɑ', audio_url: '' },
    { id: 9, ipa: 'ʊ', audio_url: '' },
    { id: 10, ipa: 'u', audio_url: '' },
    { id: 11, ipa: 'o', audio_url: '' },
    { id: 12, ipa: 'ɔ', audio_url: '' },
];

// Styled components for grid labels
const GridLabelContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const RowLabelsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-right: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small} 0;
`;

const GridLabel = styled(PhonemeGridText)`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const FeedbackContainer = styled.div<{ $isCorrect: boolean }>`
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ $isCorrect }) =>
        $isCorrect ? 'rgba(163, 217, 163, 0.2)' : 'rgba(255, 214, 153, 0.2)'};
  border: ${({ theme }) => theme.borderWidths.default} solid 
    ${({ $isCorrect }) =>
        $isCorrect ? '#a3d9a3' : '#ffd699'};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const InstructionText = styled(Text).attrs({
    variant: 'instruction',
    as: 'p',
})`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const GridContainer = styled.div`
  display: flex;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

const StyledPaper = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.medium};
  border: ${({ theme }) => theme.border.default};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

export function TonguePositionQuiz() {
    const [quizState, setQuizState] = useState<GridQuizState | null>(null);
    const [feedback, setFeedback] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);

    // Initialize quiz on component mount
    useEffect(() => {
        initializeQuiz();
    }, []);

    const initializeQuiz = () => {
        try {
            // Parse the tongue position data and create cells
            const cells = GridQuizService.parseTonguePositionData(
                tonguePositionData as any,
                mockVowels
            );

            // Create a quiz with these cells
            if (cells.length > 0) {
                setQuizState(GridQuizService.createQuiz(cells, 3));
            } else {
                // Fallback to demo quiz if parsing fails
                setQuizState(GridQuizService.generateDemoQuiz(3));
            }
        } catch (error) {
            console.error('Failed to initialize quiz:', error);
            // Fallback to demo quiz
            setQuizState(GridQuizService.generateDemoQuiz(3));
        }
    };

    if (!quizState) {
        return <div>Loading phoneme grid quiz...</div>;
    }

    // Convert cells to grid items
    const gridItems = GridQuizService.cellsToGridItems(quizState.cells);

    // Handle cell reordering
    const handleOrderChange = (newItems: any[]) => {
        if (isSubmitted && isCorrect) return; // Prevent changes after correct submission

        // Update cell positions based on new order
        const newCells = [...quizState.cells];

        newItems.forEach((item, index) => {
            const cellIndex = newCells.findIndex(cell => cell.id === item.id);
            if (cellIndex !== -1) {
                const row = Math.floor(index / 3);
                const col = index % 3;
                newCells[cellIndex] = {
                    ...newCells[cellIndex],
                    currentPosition: { row, col }
                };
            }
        });

        setQuizState({
            ...quizState,
            cells: newCells
        });

        // Reset feedback if user makes changes after submission
        if (isSubmitted) {
            setIsSubmitted(false);
            setFeedback('');
        }
    };

    // Handle quiz submission
    const handleSubmit = () => {
        const result = GridQuizService.checkAnswer(quizState);
        setFeedback(result.feedback);
        setIsCorrect(result.isCorrect);
        setIsSubmitted(true);
        setScore(result.score);
    };

    // Reset the quiz to random positions
    const handleReset = () => {
        const shuffledState = {
            ...quizState,
            cells: GridQuizService.shuffleCells([...quizState.cells], 3)
        };
        setQuizState(shuffledState);
        setFeedback('');
        setIsSubmitted(false);
        setIsCorrect(false);
        setScore(0);
    };

    return (
        <Stack>
            <InstructionText>
                Arrange the phoneme symbols in their correct positions based on tongue height and frontness.
                Drag and drop the cells to rearrange them.
            </InstructionText>

            {/* Grid with labels */}
            <Box>
                {/* Column labels */}
                <GridLabelContainer>
                    <GridLabel weight="medium">Front</GridLabel>
                    <GridLabel weight="medium">Central</GridLabel>
                    <GridLabel weight="medium">Back</GridLabel>
                </GridLabelContainer>

                <GridContainer>
                    {/* Row labels */}
                    <RowLabelsContainer>
                        <GridLabel weight="medium">High</GridLabel>
                        <GridLabel weight="medium">Mid</GridLabel>
                        <GridLabel weight="medium">Low</GridLabel>
                    </RowLabelsContainer>

                    {/* Grid */}
                    <StyledPaper>
                        <ConfigurableGrid
                            mode="sortable"
                            items={gridItems}
                            cols={3}
                            spacing="md"
                            onOrderChange={handleOrderChange}
                        />
                    </StyledPaper>
                </GridContainer>
            </Box>

            {/* Feedback area */}
            {feedback && (
                <FeedbackContainer $isCorrect={isCorrect}>
                    <Text variant="body">{feedback}</Text>
                    {isSubmitted && (
                        <Text variant="body" margin={theme.spacing.small}>
                            Your score: {score}%
                        </Text>
                    )}
                </FeedbackContainer>
            )}

            {/* Submit/Reset buttons using MenuPresets.SubmitResetGroup */}
            <ButtonContainer>
                <MenuPresets.SubmitResetGroup
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    size="md"
                />
            </ButtonContainer>
        </Stack>
    );
}
