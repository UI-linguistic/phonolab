// /**
//  * ProgressBar.tsx
//  *
//  * Component: <ProgressBar />
//  *
//  * Description:
//  * A simple, theme-aware progress bar component for page modules.
//  * It can operate in two modes:
//  *   1. Bar-only — renders a minimal progress bar
//  *   2. Bar + label — shows numeric progress (e.g., "2 / 3") next to the bar
//  *
//  * The component is visually centered and wrapped in a padded container for layout control.
//  *
//  * Props:
//  * - current: number — current progress step (e.g., 2)
//  * - total: number   — total steps (e.g., 3)
//  * - showLabel?: boolean — whether to show "current / total" label
//  *
//  * Styling:
//  * - Uses theme colors for background, text, and accent fill
//  * - Includes animation on progress change
//  * - Uses a rounded capsule style for the bar container
//  *
//  * Example:
//  * <QuizProgressBar current={2} total={3} />         // bar only
//  * <QuizProgressBar current={2} total={3} showLabel /> // bar + label
//  */


// import React from 'react';
// import styled from 'styled-components';

// interface ProgressBarProps {
//   current: number;
//   total: number;
//   showLabel?: boolean;
// }

// const ProgressWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: ${({ theme }) => theme.spacing.medium};
//   padding: ${({ theme }) => theme.spacing.small};
// `;

// const BarContainer = styled.div`
//   width: 160px;
//   height: 16px;
//   background-color: ${({ theme }) => theme.colors.backgroundAccent};
//   border: 2px solid ${({ theme }) => theme.colors.text};
//   border-radius: 999px;
//   overflow: hidden;
// `;

// const BarFill = styled.div<{ progress: number }>`
//   height: 100%;
//   width: ${({ progress }) => `${progress}%`};
//   background-color: ${({ theme }) => theme.colors.text};
//   transition: width 0.3s ease-in-out;
// `;

// const CountLabel = styled.div`
//   font-size: ${({ theme }) => theme.fontSizes.sm};
//   font-family: ${({ theme }) => theme.fonts.main};
//   border: 1px solid ${({ theme }) => theme.colors.text};
//   padding: 0.2rem 0.5rem;
//   border-radius: ${({ theme }) => theme.borderRadius};
// `;

// export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total, showLabel = false }) => {
//   const progress = Math.min((current / total) * 100, 100);

//   return (
//     <ProgressWrapper>
//       <BarContainer>
//         <BarFill progress={progress} />
//       </BarContainer>
//       {showLabel && <CountLabel>{`${current} / ${total}`}</CountLabel>}
//     </ProgressWrapper>
//   );
// };

// export default ProgressBar;
export { };