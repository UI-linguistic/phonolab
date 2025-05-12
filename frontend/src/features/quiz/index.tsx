// src/features/quiz/index.tsx
import { Route } from "react-router-dom";
import QuizMenu from "./QuizMenu";
import VowelShufflePage from "./VowelShuffle/VowelShufflePage";
import VowelShuffleIntroPage from "./VowelShuffle/VowelShuffleIntroPage";
import { SpellTellPage } from "./SpellTellPage";
import { PairPlayPage } from "./PairPlay";
import { PhonicTrioPage } from "./PhonicTrio";

export const QuizRoutes = [
    // "Test Your Knowledge" menu
    <Route key="quiz-menu" path="quiz" element={<QuizMenu />} />,

    // Vowel Shuffle - split into intro and quiz pages
    <Route key="quiz-vowel-shuffle-intro" path="quiz/vowel-shuffle" element={<VowelShuffleIntroPage />} />,
    <Route key="quiz-vowel-shuffle-play" path="quiz/vowel-shuffle/play" element={<VowelShufflePage />} />,

    // all the "coming soon" placeholders:
    <Route key="quiz-spelltell" path="quiz/spell-tell" element={<SpellTellPage />} />,
    <Route key="quiz-pairplay" path="quiz/pair-play" element={<PairPlayPage />} />,
    <Route key="quiz-phonic" path="quiz/phonic-trio" element={<PhonicTrioPage />} />,
];