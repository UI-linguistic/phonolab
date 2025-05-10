// src/features/learn/types.ts

/**
 * A single section within a lesson.
 * For Vowels101, keys might be 'lip', 'tongue', 'length', etc.
 */
export interface LessonSection {
    id: string;
    name: string;
    content: string;
    // you can extend with image URLs, audio URLs, metadata, etc.
}

/**
 * The map of all sections for the Vowels101 lesson.
 * Adjust keys to match whatever sections your API returns.
 */
export interface LessonSectionMap {
    lip: LessonSection[];
    tongue: LessonSection[];
    length: LessonSection[];
    // if you add more sections, include them here:
    // e.g. diphthongs?: LessonSection[];
    [key: string]: LessonSection[];
}

export type SectionKey = keyof LessonSectionMap;

/**
 * The top‑level Lesson type returned by your API.
 */
export interface Lesson {
    id: number;
    slug: string;           // e.g. 'vowels-101'
    name: string;          // human‑readable title
    sections: LessonSectionMap;
    // you can add other fields (e.g. description, thumbnail) as needed
}


