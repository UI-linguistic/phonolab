// src/features/learn/Vowels101/types.ts

/**
 * Represents a vowel sound with its properties
 */
export interface Vowel {
    id: number;
    ipa: string;
    audio_url: string;
    lip_image_url: string;
    tongue_image_url: string;
}

/**
 * Represents a cell in the vowel grid
 */
export interface VowelGridCell {
    id: number;
    row: number;
    col: number;
    lip_type?: string;
    length_type?: string;
    vowels: Vowel[];
}

/**
 * A single section within a lesson
 */
export interface LessonSection {
    id: number;
    name: string;
    slug: string;
    cells: VowelGridCell[];
}

/**
 * The top-level Lesson type returned by the API
 */
export interface Lesson {
    id: number;
    name: string;
    slug: string;
    description: string;
    sections: LessonSection[];
}

/**
 * Response format from the API
 */
export interface ApiResponse {
    status: string;
    message: string;
    data: Lesson;
}

/**
 * Helper function to categorize sections by type
 */
export function getSectionsByType(sections: LessonSection[]): {
    lip: LessonSection[];
    tongue: LessonSection[];
    length: LessonSection[];
    [key: string]: LessonSection[]; // Allow additional string keys
} {
    const result: {
        lip: LessonSection[];
        tongue: LessonSection[];
        length: LessonSection[];
        [key: string]: LessonSection[];
    } = {
        lip: [],
        tongue: [],
        length: []
    };

    sections.forEach(section => {
        if (section.slug.includes('lip') || section.name.toLowerCase().includes('lip')) {
            result.lip.push(section);
        } else if (section.slug.includes('tongue') || section.name.toLowerCase().includes('tongue')) {
            result.tongue.push(section);
        } else if (section.slug.includes('length') || section.name.toLowerCase().includes('length')) {
            result.length.push(section);
        } else {
            // Create category if it doesn't exist
            const category = section.slug.split('-')[0];
            if (!result[category]) {
                result[category] = [];
            }
            result[category].push(section);
        }
    });

    return result;
}


/**
 * Legacy type for backward compatibility
 * @deprecated Use the new types instead
 */
export interface LegacyLessonSectionMap {
    lip: Array<{ id: string; title: string; content: string }>;
    tongue: Array<{ id: string; title: string; content: string }>;
    length: Array<{ id: string; title: string; content: string }>;
}

/**
 * Converts the new data structure to the legacy format
 * @deprecated Use the new types instead
 */
export function convertToLegacyFormat(lesson: Lesson): {
    id: number;
    slug: string;
    title: string;
    sections: LegacyLessonSectionMap;
} {
    const sectionsByType = getSectionsByType(lesson.sections);

    const legacyMap: LegacyLessonSectionMap = {
        lip: sectionsByType.lip.map(section => ({
            id: section.id.toString(),
            title: section.name,
            content: JSON.stringify(section.cells)
        })),
        tongue: sectionsByType.tongue.map(section => ({
            id: section.id.toString(),
            title: section.name,
            content: JSON.stringify(section.cells)
        })),
        length: sectionsByType.length.map(section => ({
            id: section.id.toString(),
            title: section.name,
            content: JSON.stringify(section.cells)
        }))
    };

    return {
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.name,
        sections: legacyMap
    };
}
