import { Lesson } from "../types";


export async function fetchVowels101Lesson(): Promise<Lesson> {
    const response = await fetch('/api/lesson/vowels101');
    if (!response.ok) {
        throw new Error('Failed to fetch vowels101 lesson');
    }
    return response.json();
} 