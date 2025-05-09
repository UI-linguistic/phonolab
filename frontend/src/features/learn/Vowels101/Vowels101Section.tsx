// src/components/ui/VowelSection.tsx
import styled from 'styled-components';

export const SectionContainer = styled.section`
  margin: 32px 0;
`;

export const VowelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 16px;
  margin: 24px 0;
`;

export const VowelCell = styled.div`
  padding: 16px;
  border-radius: 8px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const VowelContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const IPA = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

export const VowelImages = styled.div`
  display: flex;
  gap: 8px;

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }
`;

export const AudioPlayer = styled.div`
  width: 100%;
  max-width: 200px;
`;

export const ErrorMessage = styled.div`
  color: #d32f2f;
  padding: 16px;
  border: 1px solid #d32f2f;
  border-radius: 4px;
  background-color: #ffebee;
`;


export const PageTitle = styled.h2`
  text-align: center;
  margin: ${({ theme }) => `${theme.spacing.medium} 0`};
  outline: 2px dashed rgba(0, 200, 100, 0.6);
`;

export const PageContainer = styled.div`
  display: grid;
  grid-template-rows:
    auto   /* header */
    auto   /* title */
    auto   /* back+title row */
    auto   /* nav */
    1fr    /* content area */
  ;
  height: 100vh;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};

  /* DEBUG: outline the full page container */
  outline: 2px dashed rgba(128, 0, 128, 0.6);
`;