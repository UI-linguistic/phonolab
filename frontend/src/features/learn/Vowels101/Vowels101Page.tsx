// src/features/learn/Vowels101/Vowels101Page.tsx
import React from 'react';
import styled from 'styled-components';
import {
    Tabs as TabsWrapper,
    SectionContainer,
} from './Vowels101.styles';
import {
    SectionTabs,
    TongueSection,
    LipSection,
    LengthSection,
} from './components';
import { useVowels101 } from './hooks/useVowels101';


const PageWrapper = styled.div`padding: 2rem;`;
const Title = styled.h1`margin-bottom: 1.5rem;`;

export const Vowels101Page: React.FC = () => {

    const { data: lesson, loading, error } = useVowels101();

    const [activeSlug, setActiveSlug] = React.useState<string>('');
    React.useEffect(() => {
        if (lesson) setActiveSlug(lesson.sections[0]?.slug || '');
    }, [lesson]);

    if (loading) return <PageWrapper>Loading…</PageWrapper>;
    if (error) return <PageWrapper>Error: {error}</PageWrapper>;
    if (!lesson) return <PageWrapper>No lesson data</PageWrapper>;

    const activeSection = lesson.sections.find(s => s.slug === activeSlug);

    return (
        <PageWrapper>
            <Title>Vowels are organized in three ways:</Title>

            <TabsWrapper>
                <SectionTabs
                    sections={lesson.sections.map(({ id, name, slug }) => ({ id, name, slug }))}
                    activeSlug={activeSlug}
                    onSelect={setActiveSlug}
                />
            </TabsWrapper>

            {activeSection && (
                <SectionContainer>
                    {activeSlug === 'tongue-position' && (
                        <TongueSection section={activeSection} />
                    )}
                    {activeSlug === 'lip-shape' && (
                        <LipSection section={activeSection} />
                    )}
                    {activeSlug === 'length' && (
                        <LengthSection section={activeSection} />
                    )}
                </SectionContainer>
            )}
        </PageWrapper>
    );
};
