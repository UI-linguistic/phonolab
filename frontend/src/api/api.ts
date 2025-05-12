// src/config/api.ts

import { fallbackTongueGrid } from '@components/display/DataDrivenGrid';
import { PhonicTrioQuiz } from './types';

/*────────────────────────────────────────────────────────────
  Centralized API endpoints & JSON fallback importers
  - All data‑driven grid presets pull from here
───────────────────────────────────────────────────────────*/
export interface APIEndpointConfig {
    /** REST API URL */
    url: string;
    /** Optional dynamic import for local JSON fallback */
    fallbackImporter?: () => Promise<{
        default: any[] | { status: string; message: string; data: { sections: any[] } } | PhonicTrioQuiz
    }>;
}

// Base URL for all endpoints
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';

// Export consolidated config mapping keys to endpoint + fallback
export const API_CONFIG: Record<string, APIEndpointConfig> = {
    /*───────────────────────────────────────────────────────────
      General Endpoints
    ────────────────────────────────────────────────────────────*/
    LESSONS: {
        url: `${API_BASE_URL}/api/lessons`,
        // no fallback for generic lessons list
    },
    VOWELS: {
        url: `${API_BASE_URL}/api/vowels`,
        // generic vowels data
    },
    IMAGES: {
        url: `${API_BASE_URL}/images`,
    },
    AUDIO: {
        url: `${API_BASE_URL}/audio`,
    },
    AUDIO_VOWELS: {
        url: `${API_BASE_URL}/api/audio/vowels`,
    },

    /*───────────────────────────────────────────────────────────
      Learn Feature Endpoints + Fallbacks
    ────────────────────────────────────────────────────────────*/
    'learn/vowels/tongue-position': {
        url: `${API_BASE_URL}/api/learn/vowels/tongue-position`,
        fallbackImporter: () =>
            fallbackTongueGrid(() => import('./fallback/vowels-101.json')),
    },
    'learn/vowels/lip-shape': {
        url: `${API_BASE_URL}/api/learn/vowels/lip-shape`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/lip-shape.json');
            } catch (e) {
                console.warn('Fallback file missing: lip-shape.json');
                return { default: [] };
            }
        },
    },
    'learn/vowels/length': {
        url: `${API_BASE_URL}/api/learn/vowels/length`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/length.json');
            } catch (e) {
                console.warn('Fallback file missing: length.json');
                return { default: [] };
            }
        },
    },
    'learn/graphemes/get-your-graphemes-right': {
        url: `${API_BASE_URL}/api/learn/graphemes/get-your-graphemes-right`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/get-your-graphemes-right.json');
            } catch (e) {
                console.warn('Fallback file missing: get-your-graphemes-right.json');
                return { default: [] };
            }
        },
    },
    'learn/graphemes/tackle-tricky-pairs': {
        url: `${API_BASE_URL}/api/learn/graphemes/tackle-tricky-pairs`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/tackle-tricky-pairs.json');
            } catch (e) {
                console.warn('Fallback file missing: tackle-tricky-pairs.json');
                return { default: [] };
            }
        },
    },

    /*───────────────────────────────────────────────────────────
      Quiz Feature Endpoints + Fallbacks
    ────────────────────────────────────────────────────────────*/
    'quiz/vowel-shuffle/tongue-position': {
        url: `${API_BASE_URL}/api/quiz/vowel-shuffle/tongue-position`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/tongue-position.json');
            } catch (e) {
                console.warn('Fallback file missing: tongue-position.json');
                return { default: [] };
            }
        },
    },
    'quiz/vowel-shuffle/lip-shape': {
        url: `${API_BASE_URL}/api/quiz/vowel-shuffle/lip-shape`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/lip-shape.json');
            } catch (e) {
                console.warn('Fallback file missing: lip-shape.json');
                return { default: [] };
            }
        },
    },
    'quiz/vowel-shuffle/length': {
        url: `${API_BASE_URL}/api/quiz/vowel-shuffle/length`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/length.json');
            } catch (e) {
                console.warn('Fallback file missing: length.json');
                return { default: [] };
            }
        },
    },
    'quiz/spell-and-tell': {
        url: `${API_BASE_URL}/api/quiz/spell-and-tell`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/spell-and-tell.json');
            } catch (e) {
                console.warn('Fallback file missing: spell-and-tell.json');
                return { default: [] };
            }
        },
    },
    'quiz/pair-play': {
        url: `${API_BASE_URL}/api/quiz/pair-play`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/pair-play.json');
            } catch (e) {
                console.warn('Fallback file missing: pair-play.json');
                return { default: [] };
            }
        },
    },
    'quiz/phonic-trio': {
        url: `${API_BASE_URL}/api/quiz/phonic-trio`,
        fallbackImporter: async () => {
            try {
                return await import('./fallback/phonic-trio.json');
            } catch (e) {
                console.warn('Fallback file missing: phonic-trio.json');
                return { default: [] };
            }
        },
    },
};

/**
 * Utility to load a lesson fallback (e.g., vowels-101_preview.json)
 * Handles both API envelope and raw object formats
 */
export async function loadLessonFallback(importer: () => Promise<any>) {
    const mod = await importer();
    // If wrapped in API envelope, extract .data
    if (mod.default && mod.default.data) {
        return mod.default.data;
    }
    // If raw object, just return it
    return mod.default || mod;
}

export default API_CONFIG;
