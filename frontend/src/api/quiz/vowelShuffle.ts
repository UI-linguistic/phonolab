// src/api/quizzes/vowelShuffle.ts
import { api } from '../client';
import stubData from './vowelShuffleStub.json';

export interface VowelSection<T> {
    id: string;
    type: 'tongue' | 'lip' | 'length';
    title: string;
    items: T[];
    correctOrder: string[];
}

export interface QuizResult {
    total: number;
    earned: number;
    perSection: Record<string, number>;
}

// Base endpoint for this quiz
const BASE = '/quiz/vowel‑shuffle';

export async function fetchVowelSections<T>(): Promise<VowelSection<T>[]> {
    if (process.env.NODE_ENV === 'development') {
        return stubData as unknown as VowelSection<T>[];
    }
    const res = await api.get<VowelSection<T>[]>(`${BASE}/sections`);
    return res.data;
}

export async function submitVowelSection(
    sectionId: string,
    order: string[]
): Promise<{ success: boolean; earned: number }> {
    if (process.env.NODE_ENV === 'development') {
        // naive stub: full points if any order
        return { success: true, earned: order.length };
    }

    const res = await api.post<{ success: boolean; earned: number }>(
        `${BASE}/section/${sectionId}`,
        { order }
    );
    return res.data;
}

export async function submitVowelQuiz(
    answers: Record<string, string[]>
): Promise<QuizResult> {
    if (process.env.NODE_ENV === 'development') {
        // simple stub
        return {
            total: Object.keys(answers).length,
            earned: Object.keys(answers).length,
            perSection: Object.fromEntries(
                Object.keys(answers).map((id) => [id, answers[id].length])
            ),
        };
    }

    const res = await api.post<QuizResult>(`${BASE}/complete`, answers);
    return res.data;
}
