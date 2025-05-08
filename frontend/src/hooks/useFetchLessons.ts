// src/hooks/useFetchLessons.ts
import { useState, useEffect } from 'react';
import type { Lesson } from '@features/learn/Vowels101/types';
import { fetchVowels101Lesson } from '@api/lessons';

export function useFetchLessons() {
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
