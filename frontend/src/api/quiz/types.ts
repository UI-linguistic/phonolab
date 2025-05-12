// src/api/quizzes/types.ts

/** One section in the Vowel Shuffle quiz */
export interface VowelSection<T> {
    id: string;
    type: 'tongue' | 'lip' | 'length';
    title: string;
    items: T[];
    correctOrder: string[];
}

/** Overall result shape for any quiz */
export interface QuizResult {
    total: number;
    earned: number;
    perSection: Record<string, number>;
}

/** The shape of each “node object” inside a grid cell */
export interface NodeObject {
    id: string;
    label: string;
    audioSrc: string;
    secondaryId?: string;
    secondaryLabel?: string;
    secondaryAudioSrc?: string;
}
