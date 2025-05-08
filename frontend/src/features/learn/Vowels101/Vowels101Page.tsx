import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { LessonSection } from './types';
import { SectionTabs } from './components/SectionTabs';
import { LipSection } from './components/LipSection';
import { TongueSection } from './components/TongueSection';
import { useVowels101 } from './hooks/useVowels101';

export const Vowels101Page: React.FC = () => {
    const { data: lesson, loading, error } = useVowels101();
    const { sectionSlug } = useParams<{ sectionSlug?: string }>();
    const navigate = useNavigate();

    React.useEffect(() => {
        console.log('Vowels101Page: Navigation effect with:', { lesson, sectionSlug });

        if (lesson && !sectionSlug) {
            const tongueSection = lesson.sections.find(
                (section: LessonSection) =>
                    section.slug === 'tongue' ||
                    section.slug.includes('tongue') ||
                    section.name.toLowerCase().includes('tongue')
            );

            console.log('Vowels101Page: Found tongue section:', tongueSection);

            const defaultSection = tongueSection || lesson.sections[0];
            console.log('Vowels101Page: Navigating to default section:', defaultSection);

            navigate(`/learn/vowels-101/${defaultSection.slug}`, { replace: true });
        }
    }, [lesson, sectionSlug, navigate]);

    const activeSection = lesson?.sections.find(
        (section: LessonSection) => section.slug === sectionSlug
    );

    console.log('Vowels101Page: Active section:', activeSection);

    const handleSectionSelect = (slug: string) => {
        console.log('Vowels101Page: Section selected:', slug);
        navigate(`/learn/vowels-101/${slug}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!lesson) {
        return <div>Lesson not found</div>;
    }
    // Determine which section component to render
    const renderSectionContent = () => {
        if (!activeSection) return null;
        console.log('Vowels101Page: Rendering section content for:', activeSection.slug);

        if (activeSection.slug === 'tongue' ||
            activeSection.slug.includes('tongue') ||
            activeSection.name.toLowerCase().includes('tongue')) {

            return <TongueSection section={activeSection} />;
        } else if (activeSection.slug === 'lip' ||
            activeSection.slug.includes('lip') ||
            activeSection.name.toLowerCase().includes('lip')) {
            return <LipSection section={activeSection} />;
        } else {
            return <div>Unknown section type: {activeSection.name}</div>;
        }
    };


    return (
        <PageContainer>
            <Header>
                <Title>{lesson.name}</Title>
                <Description>{lesson.description}</Description>
            </Header>

            {lesson.sections.length > 0 && (
                <>
                    {/* Section tabs/buttons */}
                    <SectionTabs
                        sections={lesson.sections}
                        activeSlug={sectionSlug || ''}
                        onSelect={handleSectionSelect}
                    />

                    {/* Section content */}
                    {activeSection && (
                        <SectionContent>
                            <SectionTitle>{activeSection.name}</SectionTitle>
                            {renderSectionContent()}
                        </SectionContent>
                    )}
                </>
            )}
        </PageContainer>
    );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const SectionContent = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
`;
