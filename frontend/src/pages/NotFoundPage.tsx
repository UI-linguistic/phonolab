// src/pages/NotFoundPage.tsx
import React from 'react';
import styled from 'styled-components';
import { LinkButton } from '@components/navigation';
import { SubtitleContainer } from '@components/typography/PageTypography';

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xlarge};
  gap: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

export default function NotFoundPage() {
    return (
        <Center>
            <title>404: Page Not Found</title>
            <SubtitleContainer>The page you’re looking for doesn’t exist.</SubtitleContainer>
            <LinkButton to="/" variant="solid">
                Go Home
            </LinkButton>
        </Center>
    );
}
