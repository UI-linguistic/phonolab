import React from 'react';
import styled, { useTheme } from 'styled-components';
import { Container, Group, Text } from '@mantine/core';

// Define responsive footer heights directly in the component
const FOOTER_HEIGHTS = {
  mobile: '50px',
  tablet: '60px',
  desktop: '70px'
};

// Debug label component to show component names when debugging
const DebugLabel = styled.div<{ enabled: boolean; position: string }>`
  display: ${({ enabled }) => (enabled ? 'block' : 'none')};
  position: absolute;
  ${({ position }) => {
    switch (position) {
      case 'top-right':
        return 'top: 0; right: 0;';
      case 'bottom-left':
        return 'bottom: 0; left: 0;';
      case 'bottom-right':
        return 'bottom: 0; right: 0;';
      case 'top-left':
      default:
        return 'top: 0; left: 0;';
    }
  }}
  font-size: ${({ theme }) => theme.debug?.labels?.fontSize || '10px'};
  background: ${({ theme }) => theme.debug?.labels?.background || 'rgba(0, 0, 0, 0.7)'};
  color: ${({ theme }) => theme.debug?.labels?.color || 'white'};
  padding: ${({ theme }) => theme.debug?.labels?.padding || '2px 4px'};
  border-radius: ${({ theme }) => theme.debug?.labels?.borderRadius || '2px'};
  z-index: ${({ theme }) => theme.debug?.zIndex || 9999};
  pointer-events: none;
`;

const FooterContainer = styled.footer`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.container
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  /* Height & background - with responsive values */
  min-height: ${FOOTER_HEIGHTS.mobile};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  
  /* Spacing */
  padding: ${({ theme }) => theme.spacing.small} 0;
  margin-top: auto; /* Push footer to bottom of flex container */
  
  /* Border */
  border-top: ${({ theme }) => theme.border.default};
  
  /* Typography */
  font-family: ${({ theme }) => theme.fonts.inter};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: ${({ theme }) => theme.lineHeights.sm};
  
  /* Responsive adjustments using theme breakpoints */
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-height: ${FOOTER_HEIGHTS.tablet};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    line-height: ${({ theme }) => theme.lineHeights.sm};
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    min-height: ${FOOTER_HEIGHTS.desktop};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xsmall} 0;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    line-height: ${({ theme }) => theme.lineHeights.xs};
  }
  
  /* Transition for dark mode or theme changes */
  transition: ${({ theme }) => theme.transitions.medium};
`;

const FooterContent = styled(Container)`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.component
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  height: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const FooterLinks = styled(Group)`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.grid
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xsmall};
  }
`;

// Use a regular anchor tag instead of Mantine's Anchor
const StyledLink = styled.a`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.element
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.8;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-decoration: none;
  
  &:hover {
    opacity: 1;
    text-decoration: none;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
  
  transition: ${({ theme }) => theme.transitions.short};
`;

const DevLink = styled(StyledLink)`
  /* Debug outline - special focus for dev tools */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.focus
      : 'none'
  };
  
  color: #e5b3ff;
  font-weight: bold;
`;

const FooterCopyright = styled(Text)`
  /* Debug outline */
  outline: ${({ theme }) =>
    theme.debug?.enabled
      ? theme.debug.outlines.element
      : 'none'
  };
  position: relative; /* For debug label positioning */
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    text-align: center;
    order: 2; /* Move copyright below links on mobile */
  }
`;

const Trademark = styled.span`
  font-size: 0.7em;
  vertical-align: super;
  margin-left: 2px;
`;

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const isDev = process.env.NODE_ENV === 'development';
  const theme = useTheme();
  const debugEnabled = theme.debug?.enabled && theme.debug?.labels?.enabled;
  const labelPosition = theme.debug?.labels?.position || 'top-left';

  return (
    <FooterContainer>
      {debugEnabled && (
        <DebugLabel enabled={debugEnabled} position={labelPosition}>
          Footer
        </DebugLabel>
      )}

      <FooterContent size="lg">
        {debugEnabled && (
          <DebugLabel enabled={debugEnabled} position={labelPosition}>
            FooterContent
          </DebugLabel>
        )}

        <FooterCopyright>
          {debugEnabled && (
            <DebugLabel enabled={debugEnabled} position={labelPosition}>
              Copyright
            </DebugLabel>
          )}
          © {currentYear} Hooked on Phonetics<Trademark>™</Trademark>
        </FooterCopyright>

        {isDev && (
          <DevLink href="/dev">
            {debugEnabled && (
              <DebugLabel enabled={debugEnabled} position={labelPosition}>
                DevLink
              </DebugLabel>
            )}
            Dev Tools
          </DevLink>
        )}
      </FooterContent>
    </FooterContainer>
  );
}