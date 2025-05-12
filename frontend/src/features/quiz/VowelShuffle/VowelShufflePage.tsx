// // src/features/quiz/VowelShuffle/VowelShufflePage.tsx
// import React from 'react';
// import { useVowelShuffleQuiz } from './useVowelShuffleQuiz';
// import TonguePositionQuiz from './TonguePositionQuiz';
// import LipShapeQuiz from './LipShapeQuiz';
// import QuizFeedback from '../QuizFeedback';
// import { InstructionBox } from '../../../components/ui';
// import LengthQuiz from './LengthQuiz';

// export default function VowelShufflePage() {
//   const {
//     loaded,
//     current,
//     sectionNumber,
//     totalSections,
//     submittingSection,
//     submitSection,
//     finishQuiz,
//     quizResult,
//   } = useVowelShuffleQuiz();

//   if (!loaded) return <div>Loading…</div>;

//   // Start‑screen is the VowelShuffleQuizIntro file

//   // Section pages
//   switch (current?.type) {
//     case 'tongue':
//       return (
//         <TonguePositionQuiz
//           section={current}
//           onSubmit={submitSection}
//           sectionNumber={sectionNumber}
//           totalSections={totalSections}
//         />
//       );
//     case 'lip':
//       return (
//         <LipShapeQuiz
//           section={current}
//           onSubmit={submitSection}
//           sectionNumber={sectionNumber}
//           totalSections={totalSections}
//         />
//       );
//     case 'length':
//       return (
//         <LengthQuiz
//           section={current}
//           onSubmit={submitSection}
//           sectionNumber={sectionNumber}
//           totalSections={totalSections}
//         />
//       );
//     default:
//       return (
//         <QuizFeedback
//           result={quizResult!}
//           onRetake={() => window.location.reload()}
//         />
//       );
//   }
// }


// PENDING UPDATE - ONLY NEEDS COMPONENT PLACEMENT

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VowelShuffleLayout } from '@components/ui/QuizLayout';
import { StartButton } from '@components/ui/MenuPresets';
import TongueGridQuiz from '@features/learn/Vowels101/components/TongueGridQuiz';
import styled from 'styled-components';

// Container for quiz mode that spans all columns
const QuizModeContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export default function VowelShufflePage() {
  const navigate = useNavigate();
  // State to track if all vowels are correctly placed
  const [isComplete, setIsComplete] = useState(false);

  // Handle when all vowels are correctly placed
  const handleCorrectPlacement = () => {
    setIsComplete(true);
  };

  // Handle reset/try again
  const handleReset = () => {
    // Reset the quiz or navigate back to intro page
    navigate('/quiz/vowel-shuffle');
  };

  return (
    <VowelShuffleLayout
      title="Vowel Shuffle"
      quizStageLabel="Tongue Position"
    >
      <QuizModeContainer>
        <TongueGridQuiz
          onCorrectPlacement={handleCorrectPlacement}
          onComplete={() => setIsComplete(true)}
          showCorrectFeedback={true}
        />

        {isComplete && (
          <StartButton onClick={handleReset} label="Try Again" />
        )}
      </QuizModeContainer>
    </VowelShuffleLayout>
  );
}
