// src/api/lessons.ts

import axios from 'axios';
import { LessonSection } from '@api/types';
import { ApiResponse } from '@api/types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5001';

export const fetchVowels101Lesson = async (): Promise<{ sections: LessonSection[] }> => {
    try {
        const response = await axios.get<ApiResponse>(
            `${API_BASE_URL}/api/lessons/vowels-101`
        );
        return response.data.data;
    } catch (error) {
        console.error('Error fetching Vowels101 lesson:', error);
        throw error;
    }
};

export const fetchVowels101Section = async (
    sectionId: number
): Promise<{ sections: LessonSection[] }> => {
    try {
        const response = await axios.get<ApiResponse>(
            `${API_BASE_URL}/api/lessons/vowels-101/${sectionId}`
        );
        return response.data.data;
    } catch (error) {
        console.error(`Error fetching Vowels101 section ${sectionId}:`, error);
        throw error;
    }
};