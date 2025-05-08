import styled from 'styled-components';

export interface PageContainerProps {
    as?: React.ElementType;
}

const PageContainer = styled.main<PageContainerProps>`
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
  width: 100%;
  max-width: 1200px;
  padding: ${({ theme }) => theme.spacing.xlarge};
  margin: 0 auto;

  @media (max-width: 900px) {
    padding: ${({ theme }) => theme.spacing.medium};
  }
`;

export default PageContainer;