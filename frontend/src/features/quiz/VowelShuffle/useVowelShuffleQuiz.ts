// src/features/quiz/VowelShuffle/useVowelShuffleQuiz.ts
import { useState, useEffect, useCallback } from 'react';
import {
    fetchVowelSections,
    submitVowelSection,
    submitVowelQuiz,
    VowelSection,
    QuizResult,
} from './vowelShuffleService';

export type Phoneme = { id: string; symbol: string; soundUrl: string };

export function useVowelShuffleQuiz() {
    const [sections, setSections] = useState<VowelSection<Phoneme>[]>([]);
    const [idx, setIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string[]>>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<QuizResult | null>(null);

    useEffect(() => {
        fetchVowelSections<Phoneme>().then(setSections);
    }, []);

    const current = sections[idx];
    const loaded = sections.length > 0;

    const submitSection = useCallback(
        async (order: string[]) => {
            if (!current) return;
            setSubmitting(true);
            await submitVowelSection(current.id, order);
            setSubmitting(false);
            setAnswers((a) => ({ ...a, [current.id]: order }));
            setIdx((i) => i + 1);
        },
        [current]
    );

    const finishQuiz = useCallback(async () => {
        const res = await submitVowelQuiz(answers);
        setResult(res);
    }, [answers]);

    return {
        loaded,
        current,
        sectionNumber: idx + 1,
        totalSections: sections.length,
        submittingSection: submitting,
        submitSection,
        finishQuiz,
        quizResult: result,
    };
}
