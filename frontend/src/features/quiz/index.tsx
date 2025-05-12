// src/features/quiz/index.tsx
import { Route } from "react-router-dom";
import QuizMenu from "./QuizMenu";
import VowelShufflePage from "./VowelShuffle/VowelShufflePage";
import { SpellTellPage } from "./SpellTellPage";
import { PairPlayPage } from "./PairPlay";
import { PhonicTrioPage } from "./PhonicTrio";

export const QuizRoutes = [
    // “Test Your Knowledge” menu
    <Route key="quiz-menu" path="quiz" element={<QuizMenu />} />,

    // 1)Vowel Shuffle -> has a start button, button leads to start of quiz



    // all the “coming soon” placeholders:
    <Route key="quiz-spelltell" path="quiz/spell-tell" element={<SpellTellPage />} />,
    <Route key="quiz-pairplay" path="quiz/pair-play" element={<PairPlayPage />} />,
    <Route key="quiz-phonic" path="quiz/phonic-trio" element={<PhonicTrioPage />} />,

];