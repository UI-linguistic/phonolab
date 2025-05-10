// src/features/learn/Vowels101/Vowels101Page.tsx


// PENDING UPDATE BUT WORKS WITH BACKEND!

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';

import PageContainer from '@components/ui/PageContainer';
import { TongueSection, LipSection, LengthSection } from './components';

import { fetchVowels101Lesson } from '../../../api/lessons';
import {
    Lesson,
    LessonSection,
    ApiResponse,
    getSectionsByType
} from './types';
import PageNavButton from '@components/navigation/PageNavButton';
import { PageTitle } from '@components/typography/PageTypography';

const SECTION_LABELS = ['Tongue', 'Lip', 'Length'] as const;
const SECTION_KEYS = ['tongue', 'lip', 'length'] as const;
type SectionIndex = 0 | 1 | 2;

export const Vowels101Page: React.FC = () => {
    // Loading & error state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Lesson data & categorized map
    const [byType, setByType] = useState<ReturnType<typeof getSectionsByType> | null>(null);

    // UI state
    const [activeIndex, setActiveIndex] = useState<SectionIndex>(0);

    // Fetch once on mount
    useEffect(() => {
        fetchVowels101Lesson()
            .then((lesson: Lesson) => {
                const categorized = getSectionsByType(lesson.sections);
                setByType(categorized);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to load lesson.');
                setLoading(false);
            });
    }, []);

    // Derive the current section list
    const activeSections = useMemo<LessonSection[] | null>(() => {
        if (!byType) return null;
        return byType[SECTION_KEYS[activeIndex]];
    }, [byType, activeIndex]);

    // Render the correct section component
    const renderSection = useCallback(() => {
        if (!activeSections) return null;
        switch (activeIndex) {
            case 0: return <TongueSection sections={activeSections} />;
            case 1: return <LipSection sections={activeSections} />;
            case 2: return <LengthSection sections={activeSections} />;
        }
    }, [activeIndex, activeSections]);

    if (loading) return <PageContainer>Loading…</PageContainer>;
    if (error) return <PageContainer>Error: {error}</PageContainer>;

    return (
        <PageContainer>
            <PageNavButton direction="left" onClick={() => { }} />
            <title>Vowels are organized in three ways:</title>
            <NavRow>
                {/* <SectionNav
                    sections={Array.from(SECTION_LABELS)}
                    activeIndex={activeIndex}
                    onChange={idx => setActiveIndex(idx as SectionIndex)}
                /> */}
            </NavRow>

            <ContentArea>
                {renderSection()}
            </ContentArea>
        </PageContainer>
    );
};

export default Vowels101Page;

/** ────────────────────────────────────────────────────────────
 * Styled slots (no debug outlines)
 * ────────────────────────────────────────────────────────────
 */

const NavRow = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const ContentArea = styled.div`
  outline: 2px dashed rgba(128, 0, 128, 0.6);
`;
