import React from 'react';
import { InstructionBox } from './InstructionBox';
import { Text } from '../typography/PageTypography';
import styled from 'styled-components';

// Responsive container for instruction groups
const ResponsiveInstructionContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: ${({ theme }) => theme.spacing.small};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.xsmall};
  }
`;

export function Vowels101Instructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox variant="transparent"> </InstructionBox>
            <InstructionBox
                variant="transparent"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                Vowels are distinguished by the part of the tongue used to make the sound ([secondary]front to back[/secondary])…
            </InstructionBox>
            <InstructionBox
                variant="transparent"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                And the placement of the tongue relative to the roof of the mouth ([primary]high to low[/primary]).
            </InstructionBox>
            <InstructionBox
                variant="transparent"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                [bold]Click[/bold] a vowel in the grid to hear it and learn how to place your tongue!
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * TonguePositionInstructions - No border version for the tongue position section
 * Text is left-aligned with colored highlights
 */
export function TonguePositionInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="transparent"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                Vowels are distinguished by the part of the tongue used to make the sound ([secondary]front to back[/secondary])...
            </InstructionBox>
            <InstructionBox
                variant="transparent"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                And the placement of the tongue relative to the roof of the mouth ([primary]high to low[/primary]).
            </InstructionBox>
            <InstructionBox
                variant="transparent"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'left'
                }}
            >
                [bold]Click[/bold] a vowel in the grid to hear it and learn how to place your tongue!
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * LengthInstructions - Bordered version for the length section
 * Text is left-aligned with colored highlights
 */
export function LengthInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                [secondary]Long[/secondary] vowels are held for a longer duration than [primary]short[/primary] vowels.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                In English, vowel length is often indicated by spelling patterns, like the silent 'e' in 'bite' vs 'bit'.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'left'
                }}
            >
                [bold]Click[/bold] on the vowel pairs to hear the difference between long and short vowels!
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * TensionInstructions - Bordered version for the tension section
 * Text is left-aligned with colored highlights
 */
export function TensionInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                [secondary]Tense[/secondary] vowels are produced with more muscle tension in the tongue and mouth.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                [primary]Lax[/primary] vowels are produced with less tension and often sound more relaxed.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'left'
                }}
            >
                [bold]Click[/bold] on the vowel pairs to feel the difference in tension when pronouncing them!
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * DiphthongInstructions - Bordered version for the diphthong section
 * Text is left-aligned with colored highlights
 */
export function DiphthongInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                [secondary]Diphthongs[/secondary] are vowel sounds that involve a movement from one vowel position to another.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                They create a smooth transition between two vowel sounds within a single syllable.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'left'
                }}
            >
                [bold]Click[/bold] on each diphthong to hear the sound and see the tongue movement animation!
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * PracticeInstructions - Bordered version for the practice section
 * Text is left-aligned with colored highlights
 */
export function PracticeInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                Now it's time to [primary]practice[/primary] what you've learned!
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                Listen to the audio examples and try to identify the vowel sounds based on tongue position, length, and tension.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'left'
                }}
            >
                [bold]Click[/bold] the play button to hear each word, then select the correct vowel sound from the options.
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * MinimalPairsInstructions - Bordered version for the minimal pairs section
 * Text is left-aligned with colored highlights
 */
export function MinimalPairsInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                [secondary]Minimal pairs[/secondary] are words that differ by only one sound, making them perfect for training your ear.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                Listen carefully to distinguish between similar-sounding vowels like in "ship" vs "sheep" or "bit" vs "beat".
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'left'
                }}
            >
                [bold]Click[/bold] on each pair to hear the difference, then practice saying them yourself!
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * SummaryInstructions - Clean version for the summary section
 * Text is centered with colored highlights
 */
export function SummaryInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="noBorder"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'center'
                }}
            >
                [primary]Congratulations![/primary] You've completed the vowel sounds tutorial.
            </InstructionBox>
            <InstructionBox
                variant="noBorder"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'center'
                }}
            >
                Remember to practice regularly to improve your pronunciation and listening skills.
            </InstructionBox>
            <InstructionBox
                variant="noBorder"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'center'
                }}
            >
                [bold]Continue[/bold] to the next module to learn about consonant sounds!
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

/**
 * QuizInstructions - Bordered version for the quiz section
 * Text is left-aligned with colored highlights
 */
export function QuizInstructions() {
    return (
        <ResponsiveInstructionContainer>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                Let's test your knowledge with a quick [secondary]quiz[/secondary]!
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    weight: 'bold',
                    align: 'left'
                }}
            >
                Listen to each audio clip and identify the vowel sound based on what you've learned.
            </InstructionBox>
            <InstructionBox
                variant="default"
                textProps={{
                    variant: 'layoutInstruction',
                    align: 'left'
                }}
            >
                [bold]Select[/bold] the correct answer from the options provided for each question.
            </InstructionBox>
        </ResponsiveInstructionContainer>
    );
}

export default {
    Vowels101Instructions,
    TonguePositionInstructions,
    LengthInstructions,
    TensionInstructions,
    DiphthongInstructions,
    PracticeInstructions,
    MinimalPairsInstructions,
    SummaryInstructions,
    QuizInstructions,
};
