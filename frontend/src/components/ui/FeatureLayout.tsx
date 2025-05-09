// src/components/layout/FeatureLayout.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { BackButton, LinkButton } from '@components/navigation';
import { SectionTitle } from '@components/ui/LayoutPrimitives';

export type FeatureMode = 1 | 2 | 3;

export interface FeatureLayoutProps {
    mode: FeatureMode;
    backTo: string;
    title: string;
    nextTo?: string;
    nextLabel?: string;
    gridItems?: React.ReactNode[];                  // mode 2 & 3
    menuItems?: { label: string; to: string }[];    // mode 3 only
    extraItems?: React.ReactNode[];                 // new: mode 2 only
    children?: React.ReactNode;                     // main content
}

const Container = styled.main<{ mode: FeatureMode }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xlarge};

  display: grid;
  grid-template-columns: auto 1fr auto;
  row-gap: ${({ theme }) => theme.spacing.large};

  /* mode 1: back/title + content */
  ${({ mode }) =>
        mode === 1 &&
        css`
      grid-template-rows:
        auto
        1fr;
    `}

  /* mode 2: back/title + 2×2 grid + extra row + content */
  ${({ mode }) =>
        mode === 2 &&
        css`
      grid-template-rows:
        auto
        auto   /* 2×2 grid */
        auto   /* extraItems row */
        1fr;   /* your children */
    `}

  /* mode 3: back/title + menu row + 4‑in‑a‑row grid + content */
  ${({ mode }) =>
        mode === 3 &&
        css`
      grid-template-rows:
        auto
        auto   /* menuItems row */
        auto   /* original 4‑in‑a‑row grid */
        1fr;
    `}
`;

const TitleRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;


const TwoByTwoGrid = styled.div`
  grid-column: 1 / -1;
  display: grid;

  /* each column is at least 26rem, but will expand equally to fill extra space */
  grid-template-columns: repeat(2, minmax(26rem, 1fr));

  gap: ${({ theme }) => theme.spacing.xlarge};
  margin-top: ${({ theme }) => theme.spacing.xlarge};
  justify-items: center;
`;

const OriginalGrid = styled.div`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.medium};
`;

const CenterRow = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

const MainContent = styled.div`
  grid-column: 1 / -1;
  margin-top: ${({ theme }) => theme.spacing.large};
`;

export default function FeatureLayout({
    mode,
    backTo,
    title,
    nextTo,
    nextLabel,
    gridItems = [],
    menuItems = [],
    extraItems = [],
    children,
}: FeatureLayoutProps) {
    return (
        <Container mode={mode}>
            {/* 1) back + title + optional next */}
            <TitleRow>
                <BackButton to={backTo} />
                <SectionTitle align="center">{title}</SectionTitle>
                {nextTo && nextLabel ? (
                    <LinkButton to={nextTo} variant="solid">
                        {nextLabel}
                    </LinkButton>
                ) : (
                    <div /> /* placeholder so space-between works */
                )}
            </TitleRow>

            {/* 2) mode 2: 2×2 grid */}
            {mode === 2 && (
                <>
                    <TwoByTwoGrid>
                        {gridItems.map((item, i) => (
                            <div key={i}>{item}</div>
                        ))}
                    </TwoByTwoGrid>

                    {/* 3) mode 2: extra centered row */}
                    {extraItems.length > 0 && (
                        <CenterRow>
                            {extraItems.map((item, i) => (
                                <div key={i}>{item}</div>
                            ))}
                        </CenterRow>
                    )}
                </>
            )}

            {/* 4) mode 3: menu row + original 4‑col grid */}
            {mode === 3 && (
                <>
                    <CenterRow>
                        {menuItems.map((m, i) => (
                            <LinkButton key={i} to={m.to} variant="outline">
                                {m.label}
                            </LinkButton>
                        ))}
                    </CenterRow>
                    <OriginalGrid>
                        {gridItems.map((item, i) => (
                            <div key={i}>{item}</div>
                        ))}
                    </OriginalGrid>
                </>
            )}

            {/* 5) finally your page content */}
            <MainContent>{children}</MainContent>
        </Container>
    );
}
