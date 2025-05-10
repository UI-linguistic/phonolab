import React from 'react';
import styled from 'styled-components';
import { PageTitle } from '../typography/PageTypography';

// Layout component props
interface LearnLayoutProps {
    title: string;
    showBackButton?: boolean;
    sectionTabs?: string[]; // names of tabs if any
    activeTabIndex?: number;
    onTabSelect?: (index: number) => void;
    variant?: 'single' | 'twoColumns' | 'multiRows';
    children: React.ReactNode;
}

// Styled components
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  padding: ${({ theme }) => theme.spacing.large};
  background-color: transparent;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const BackButtonWrapper = styled.div`
  align-self: flex-start;
`;

const SectionTabsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  border-bottom: 2px solid ${({ theme }) => theme.colors.secondary};
`;

const ContentWrapper = styled.div<{ variant?: LearnLayoutProps['variant'] }>`
  display: grid;
  ${({ variant }) => {
        switch (variant) {
            case 'twoColumns':
                return 'grid-template-columns: 1fr 1fr; gap: 2rem;';
            case 'multiRows':
                return 'grid-template-rows: auto auto; gap: 2rem;';
            default:
                return 'grid-template-columns: 1fr;';
        }
    }}
`;

// Main layout component
const LearnLayout: React.FC<LearnLayoutProps> = ({
    title,
    showBackButton = true,
    sectionTabs,
    activeTabIndex = 0,
    onTabSelect,
    variant = 'single',
    children,
}) => (
    <LayoutWrapper>
        {showBackButton && <BackButtonWrapper>{/* Back button placeholder */}</BackButtonWrapper>}

        <PageTitle>{title}</PageTitle>

        {sectionTabs && (
            <SectionTabsWrapper>
                {sectionTabs.map((tab, idx) => (
                    <button key={idx} onClick={() => onTabSelect?.(idx)}>
                        {tab}
                    </button>
                ))}
            </SectionTabsWrapper>
        )}

        <ContentWrapper variant={variant}>{children}</ContentWrapper>
    </LayoutWrapper>
);

export default LearnLayout;
