// src/features/quiz/index.tsx

import { Route } from "react-router-dom";
import QuizMenu from "./QuizMenu";
import { VowelShufflePage } from "./VowelShuffle/VowelShufflePage";
import { SpellTellPage } from "./SpellTellPage/SpellTellPage";
import { PairPlayPage } from "./PairPlay/PairPlayPage";
import { PhonicTrioPage } from "./PhonicTrio/PhonicTrioPage";


export const QuizRoutes = [
    <Route key="quiz-menu" path="quiz" element={<QuizMenu />} />,
    <Route key="quiz-shuffle" path="quiz/shuffle" element={<VowelShufflePage />} />,
    <Route key="quiz-spelltell" path="quiz/spell-tell" element={<SpellTellPage />} />,
    <Route key="quiz-pairplay" path="quiz/pair-play" element={<PairPlayPage />} />,
    <Route key="quiz-phonic" path="quiz/phonic-trio" element={<PhonicTrioPage />} />,
];
