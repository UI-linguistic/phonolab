// src/components/ui/Menu.tsx
import React from 'react';
import styled from 'styled-components';


export const MenuContainer = styled.section`
  padding: ${({ theme }) => theme.spacing.xlarge} 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const MenuList = styled.div`
  display: grid;
  grid-template-columns: max-content;
  gap: ${({ theme }) => theme.spacing.medium};
  max-width: 300px;
  width: 100%;

  & > a {
    width: 100%;
  }

  & > a > button {
    width: 100%;
  }

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export type { ReactNode } from 'react';