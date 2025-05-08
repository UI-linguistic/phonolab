// src/pages/NotFoundPage.tsx
import React from 'react';
import styled from 'styled-components';
import { LinkButton } from '@components/navigation';
import { Heading, Text } from '@components/ui';

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
            <Heading level={1}>404: Page Not Found</Heading>
            <Text>The page you’re looking for doesn’t exist.</Text>
            <LinkButton to="/" variant="solid">
                Go Home
            </LinkButton>
        </Center>
    );
}
