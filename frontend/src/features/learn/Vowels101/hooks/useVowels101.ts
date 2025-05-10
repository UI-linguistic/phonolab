import { useState, useEffect } from 'react';
import { fetchVowels101Lesson } from '@api/lessons';
import type { Lesson as V101Lesson } from '../types';

export function useVowels101() {
    const [data, setData] = useState<V101Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('useVowels101: Fetching lesson data...');

        fetchVowels101Lesson()
            .then(lesson => {
                console.log('useVowels101: Received lesson data:', lesson);
                setData(lesson);
            })
            .catch((err: unknown) => {
                console.error('useVowels101: Error fetching lesson:', err);
                if (err instanceof Error) setError(err.message);
                else setError(String(err));
            })
            .finally(() => setLoading(false));
    }, []);

    console.log('useVowels101: Current state:', { data, loading, error });

    return { data, loading, error };
}
