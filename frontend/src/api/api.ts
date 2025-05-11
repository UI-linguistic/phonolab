// src/config/api.ts

/*────────────────────────────────────────────────────────────
  Centralized API endpoints & JSON fallback importers
  - All data‑driven grid presets pull from here
───────────────────────────────────────────────────────────*/
export interface APIEndpointConfig {
    /** REST API URL */
    url: string;
    /** Optional dynamic import for local JSON fallback */
    fallbackImporter?: () => Promise<{ default: any[] }>;
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
        fallbackImporter: () => import('../../../backend/src/data/learn/vowels/tongue-position.json'),
    },
    'learn/vowels/lip-shape': {
        url: `${API_BASE_URL}/api/learn/vowels/lip-shape`,
        fallbackImporter: () => import('../../../backend/src/data/learn/vowels/lip-shape.json'),
    },
    'learn/vowels/length': {
        url: `${API_BASE_URL}/api/learn/vowels/length`,
        fallbackImporter: () => import('../../../backend/src/data/learn/vowels/length.json'),
    },
    'learn/graphemes/get-your-graphemes-right': {
        url: `${API_BASE_URL}/api/learn/graphemes/get-your-graphemes-right`,
        fallbackImporter: () => import('../../../backend/src/data/learn/graphemes/get-your-graphemes-right.json'),
    },
    'learn/graphemes/tackle-tricky-pairs': {
        url: `${API_BASE_URL}/api/learn/graphemes/tackle-tricky-pairs`,
        fallbackImporter: () => import('../../../backend/src/data/learn/graphemes/tackle-tricky-pairs.json'),
    },

    /*───────────────────────────────────────────────────────────
      Quiz Feature Endpoints + Fallbacks
    ────────────────────────────────────────────────────────────*/
    'quiz/vowel-shuffle/tongue-position': {
        url: `${API_BASE_URL}/api/quiz/vowel-shuffle/tongue-position`,
        fallbackImporter: () => import('../../../backend/src/data/quiz/vowel-shuffle/tongue-position.json'),
    },
    'quiz/vowel-shuffle/lip-shape': {
        url: `${API_BASE_URL}/api/quiz/vowel-shuffle/lip-shape`,
        fallbackImporter: () => import('../../../backend/src/data/quiz/vowel-shuffle/lip-shape.json'),
    },
    'quiz/vowel-shuffle/length': {
        url: `${API_BASE_URL}/api/quiz/vowel-shuffle/length`,
        fallbackImporter: () => import('../../../backend/src/data/quiz/vowel-shuffle/length.json'),
    },
    'quiz/spell-and-tell': {
        url: `${API_BASE_URL}/api/quiz/spell-and-tell`,
        fallbackImporter: () => import('../../../backend/src/data/quiz/spell-and-tell.json'),
    },
    'quiz/pair-play': {
        url: `${API_BASE_URL}/api/quiz/pair-play`,
        fallbackImporter: () => import('../../../backend/src/data/quiz/pair-play.json'),
    },
    'quiz/phonic-trio': {
        url: `${API_BASE_URL}/api/quiz/phonic-trio`,
        fallbackImporter: () => import('../../../backend/src/data/quiz/phonic-trio.json'),
    },
};

export default API_CONFIG;
