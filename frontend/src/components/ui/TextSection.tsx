// src/components/ui/TextSection.tsx
import React from 'react';
import styled from 'styled-components';

export interface TextSectionProps {
  children: React.ReactNode;
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.large};
  background-color: ${({ theme }) => theme.colors.greyLight};
  border-radius: ${({ theme }) => theme.borderRadius};
  outline: 1px dashed rgba(0, 0, 0, 0.2); /* remove when polished */
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

export default function TextSection({ children }: TextSectionProps) {
  return <Container>{children}</Container>;
}
