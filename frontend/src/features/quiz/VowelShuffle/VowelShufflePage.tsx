// src/features/quiz/VowelShuffle/VowelShufflePage.tsx
import React from 'react';
import { useVowelShuffleQuiz } from './useVowelShuffleQuiz';
import TonguePositionQuiz from './TonguePositionQuiz';
import LipShapeQuiz from './LipShapeQuiz';
import QuizFeedback from '../QuizFeedback';
import { InstructionBox } from '../../../components/ui';
import LengthQuiz from './LengthQuiz';

export default function VowelShufflePage() {
  const {
    loaded,
    current,
    sectionNumber,
    totalSections,
    submittingSection,
    submitSection,
    finishQuiz,
    quizResult,
  } = useVowelShuffleQuiz();

  if (!loaded) return <div>Loading…</div>;

  // Start‑screen is the VowelShuffleQuizIntro file

  // Section pages
  switch (current?.type) {
    case 'tongue':
      return (
        <TonguePositionQuiz
          section={current}
          onSubmit={submitSection}
          sectionNumber={sectionNumber}
          totalSections={totalSections}
        />
      );
    case 'lip':
      return (
        <LipShapeQuiz
          section={current}
          onSubmit={submitSection}
          sectionNumber={sectionNumber}
          totalSections={totalSections}
        />
      );
    case 'length':
      return (
        <LengthQuiz
          section={current}
          onSubmit={submitSection}
          sectionNumber={sectionNumber}
          totalSections={totalSections}
        />
      );
    default:
      return (
        <QuizFeedback
          result={quizResult!}
          onRetake={() => window.location.reload()}
        />
      );
  }
}
