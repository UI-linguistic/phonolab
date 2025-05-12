import React from 'react';
import styled from 'styled-components';

interface QuizProgressBarProps {
    /** progress percent 0–100 */
    value: number;
    /** e.g. "1/3" */
    label?: string;
    /** Whether to show label on the right side */
    labelOnRight?: boolean;
    /** Optional height override (uses theme.progressBar.height by default) */
    height?: string;
}

// Main container for the progress bar and its label
const ProgressContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    position: relative;
`;

// The track/background of the progress bar
const ProgressTrack = styled.div`
    flex: 1 1 auto;
    position: relative;
    background-color: transparent;
    border-radius: ${({ theme }) => theme.progressBar.borderRadius || theme.borderRadius};
    border: ${({ theme }) => theme.borderWidths.thin} solid ${({ theme }) => theme.colors.black};
    height: ${({ theme }) => theme.progressBar.height};
    overflow: hidden;
`;

// The filled portion of the progress bar
const ProgressFill = styled.div<{ $value: number }>`
    width: ${props => `${props.$value}%`};
    height: 100%;
    background-color: ${({ theme }) => theme.colors.black};
    border-radius: ${({ theme }) => theme.progressBar.borderRadius || theme.borderRadius} 0 0 ${({ theme }) => theme.progressBar.borderRadius || theme.borderRadius};
`;

// The label component
const ProgressLabel = styled.div`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.black};
    margin-left: ${({ theme }) => theme.spacing.medium};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    min-width: 40px;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    white-space: nowrap;
    padding: 2px 8px;
    border: ${({ theme }) => theme.borderWidths.thin} solid ${({ theme }) => theme.colors.black};
`;

export function QuizProgressBar({
    value,
    label,
    labelOnRight = true, // Default to placing label on right
    height,
}: QuizProgressBarProps) {
    // Ensure value is valid and always visible (minimum 33.33% for "1/3")
    const displayValue = value > 0 ? value : 33.33;

    return (
        <ProgressContainer>
            <ProgressTrack style={height ? { height } : undefined}>
                <ProgressFill $value={displayValue} />
            </ProgressTrack>

            {label && labelOnRight && (
                <ProgressLabel>{label}</ProgressLabel>
            )}
        </ProgressContainer>
    );
}

// Add default theme values to the exported component
QuizProgressBar.defaultTheme = {
    progressBar: {
        height: '8px',
    },
};
