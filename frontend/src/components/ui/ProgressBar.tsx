/**
 * ProgressBar.tsx
 *
 * A minimalist progress bar with optional numeric display (e.g., "2 / 3").
 * Includes a padded wrapper to center and hug the bar.
 */

import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
    current: number;
    total: number;
    showLabel?: boolean;
}

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.small};
`;

const BarContainer = styled.div`
  width: 160px;
  height: 16px;
  background-color: ${({ theme }) => theme.colors.backgroundAccent};
  border: 2px solid ${({ theme }) => theme.colors.text};
  border-radius: 999px;
  overflow: hidden;
`;

const BarFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.text};
  transition: width 0.3s ease-in-out;
`;

const CountLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: ${({ theme }) => theme.fonts.main};
  border: 1px solid ${({ theme }) => theme.colors.text};
  padding: 0.2rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showLabel = false }) => {
    const progress = Math.min((current / total) * 100, 100);

    return (
        <ProgressWrapper>
            <BarContainer>
                <BarFill progress={progress} />
            </BarContainer>
            {showLabel && <CountLabel>{`${current} / ${total}`}</CountLabel>}
        </ProgressWrapper>
    );
};

export default ProgressBar;
