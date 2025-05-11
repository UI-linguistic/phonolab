// src/api/lessons/types.ts

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
    lip_image_url: string;
    /** URL for tongue position image */
    tongue_image_url: string;
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
 * A section of the Vowels‑101 lesson, grouping grid cells.
 */
export interface LessonSection {
    /** Section identifier */
    id: number;
    /** Human‑readable name */
    name: string;
    /** URL‑friendly slug */
    slug: string;
    /** List of grid cells in this section */
    cells: VowelGridCell[];
}

/**
 * API response wrapper for lessons endpoints.
 */
export interface ApiResponse {
    status: 'success' | 'error';
    message: string;
    data: {
        sections: LessonSection[];
    };
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
