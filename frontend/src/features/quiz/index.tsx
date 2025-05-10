// src/features/quiz/index.tsx
import { Route } from "react-router-dom";
import QuizMenu from "./QuizMenu";
import VowelShufflePage from "./VowelShuffle/VowelShufflePage";
import { SpellTellPage } from "./SpellTellPage/SpellTellPage";
import { PairPlayPage } from "./PairPlay/PairPlayPage";
import { PhonicTrioPage } from "./PhonicTrio/PhonicTrioPage";
import VowelShuffleIntro from "./VowelShuffle/VowelShuffleQuizIntro";

export const QuizRoutes = [
    // “Test Your Knowledge” menu
    <Route key="quiz-menu" path="quiz" element={<QuizMenu />} />,

    // 1) Intro / instructions
    <Route
        key="quiz‑shuffle‑intro"
        path="quiz/vowel‑shuffle"
        element={<VowelShuffleIntro />}
    />,

    // 2) Actual quiz pages, under /quiz/vowel‑shuffle/start
    <Route
        key="quiz‑shuffle‑start"
        path="quiz/vowel‑shuffle/start"
        element={<VowelShufflePage />}
    />,

    // all the “coming soon” placeholders:
    <Route key="quiz‑spelltell" path="quiz/spell‑tell" element={<SpellTellPage />} />,
    <Route key="quiz‑pairplay" path="quiz/pair‑play" element={<PairPlayPage />} />,
    <Route key="quiz‑phonic" path="quiz/phonic‑trio" element={<PhonicTrioPage />} />,
];