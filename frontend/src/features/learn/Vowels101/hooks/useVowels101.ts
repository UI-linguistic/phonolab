// src/features/learn/hooks/useVowels101.ts
import { useState, useEffect } from 'react';
import { fetchVowels101Lesson } from '@api/lessons';
import type { Lesson } from '../types';

export function useVowels101() {
    const [data, setData] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVowels101Lesson()
            .then(lesson => setData(lesson))
            .catch((err: unknown) => {
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            })
            .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
