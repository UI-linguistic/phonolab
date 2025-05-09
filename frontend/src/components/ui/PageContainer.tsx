// src/components/ui/PageContainer.tsx
import styled from 'styled-components';

export interface PageContainerProps {
  as?: React.ElementType;
}

const PageContainer = styled.main<PageContainerProps>`
  display: grid;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  margin-top: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.xlarge};
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.background};

  grid-template-rows:
    auto   /* optional "section title" row */
    auto   /* optional subtitle row */
    auto   /* optional back‑arrow row */
    auto   /* optional section‑nav row */
    1fr    /* main content (flexible!) */
  ;
  row-gap: ${({ theme }) => theme.spacing.medium};
  
  /* DEBUG outline */
  outline: 2px dashed rgba(255, 0, 255, 0.6);

  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing.medium};
    margin-top: ${({ theme }) => theme.spacing.medium};
`;

export default PageContainer;
