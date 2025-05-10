// src/features/quiz/VowelShuffle/vowelShuffleService.ts
import { api } from '../../../api/client';
import stubData from '@api/quiz/vowelShuffleStub.json';

export interface VowelSection<T> {
    id: string;
    type: 'tongue' | 'lip' | 'length';
    title: string;
    groups: T[][];           // backend will send buckets of items
    correctGroups: string[][];
}

export interface QuizResult {
    total: number;
    earned: number;
    perSection: Record<string, number>;
}

const BASE = '/quiz/vowel-shuffle';

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
        const total = Object.keys(answers).length;
        return {
            total,
            earned: total,
            perSection: Object.fromEntries(
                Object.keys(answers).map((id) => [id, answers[id].length])
            ),
        };
    }
    const res = await api.post<QuizResult>(`${BASE}/complete`, answers);
    return res.data;
}
