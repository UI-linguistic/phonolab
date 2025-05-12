// src/api/types.ts

/**
 * A single vowel entry including audio (cloud + optional fallback) and images.
 */
export interface Vowel {
    /** Unique identifier */
    id: number;
    /** IPA symbol */
    ipa: string;
    /** Primary audio URL (cloud) */
    audio_url: string;
    /** Optional secondary audio URL for fallback */
    fallback_audio_url?: string;
    /** URL for lip image */
    lip_image_url?: string;
    /** URL for tongue position image */
    tongue_image_url?: string;
}

/**
 * One cell in the Vowels‑101 grid, may contain zero or more vowels.
 */
export interface VowelGridCell {
    /** Unique cell identifier */
    id: number;
    /** Row index (0‑based) */
    row: number;
    /** Column index (0‑based) */
    col: number;
    /** Optional lip type metadata */
    lip_type?: string;
    /** Optional length type metadata */
    length_type?: string;
    /** Array of vowels in this cell (0, 1, or 2 entries) */
    vowels: Vowel[];
}


/**
 * A single section within a lesson:
 * - For Vowels101, sections might be "tongue_position", "lip_shape", "length", etc.
 * - `T` lets you supply the exact content shape per‐section.
 */
export interface LessonSection<T = any> {
    /** Section identifier or slug */
    id: string | number;
    /** Human‑readable name (e.g. "Tongue Position") */
    name: string;
    /** Section content: could be a grid, a caption, anything */
    content: T;
    /** URL‑friendly slug */
    slug: string;
}



/**
 * The top‑level Lesson object returned by your API or fallback JSON.
 * - `Sections` is a map of section‑key → LessonSection<T>
 */
export interface Lesson<T = any> {
    id: number;
    slug: string;       // e.g. "vowels-101"
    name: string;       // e.g. "Vowels 101"
    sections: Record<string, LessonSection<T>>;
}

/**
 * API response envelope.
 * - lesson endpoints often wrap their data in { status, message, data }
 * - data can be typed to your endpoint's payload shape.
 */
export interface ApiResponse<T = any> {
    status: 'success' | 'error';
    message: string;
    data: T;
}


/**
 * A generic quiz node shape, mirroring Vowel but without images.
 */
export interface QuizNode {
    /** Unique identifier */
    id: number;
    /** IPA symbol */
    ipa: string;
    /** Primary audio URL */
    audio_url?: string;
    /** Optional fallback audio URL */
    fallback_audio_url?: string;
}


export interface RawVowel {
    ipa: string;
    id: string;
    pronounced: string;
    audio_url: string[];
    mouth_image_url: string;
}

export interface RawLesson {
    content: {
        tongue_position: {
            grid: RawVowel[][][];
        };
    };
}

/**
 * Phonic Trio Quiz Types
 */

export interface PhonicTrioSettings {
    options_per_question: number;
    questions_per_phoneme: number;
}

export interface PhonicTrioSample {
    text: string;
    IPA: string;
    audio: string;
}

export interface PhonicTrioWordOption {
    language: string;
    word: string;
    IPA: string;
    audio: string;
}

export interface PhonicTrioOptionsPool {
    correct_answers: PhonicTrioWordOption[];
    wrong_answers: PhonicTrioWordOption[];
}

export interface PhonicTrioFeedback {
    correct: string;
    incorrect: string;
}

export interface PhonicTrioQuestion {
    id: number;
    target: string;
    target_audio: string;
    samples: PhonicTrioSample[];
    options_pool: PhonicTrioOptionsPool;
    feedback: PhonicTrioFeedback;
}

export interface PhonicTrioQuiz {
    settings: PhonicTrioSettings;
    quiz: PhonicTrioQuestion[];
}