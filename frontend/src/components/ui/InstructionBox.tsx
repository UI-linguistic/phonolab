import React, { ReactNode } from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components';
import { Text, TextProps } from '../typography/PageTypography';

export type InstructionVariant =
    | 'default'      // transparent bg + black border
    | 'noBorder'     // white bg, no border
    | 'transparent'  // no bg, no border

// Define WeightKey locally since it's not exported from PageTypography
type WeightKey = keyof DefaultTheme['fontWeights'];

export interface InstructionBoxProps {
    children: ReactNode;
    variant?: InstructionVariant;
    textProps?: Omit<TextProps, 'children'>;
    onClick?: () => void;
    sx?: React.CSSProperties;
    className?: string;
}

// Debug label component
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

// animated wrapper for enhanced interactive effects
const AnimatedBoxWrapper = styled.div`
  transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
  width: 100%;
  height: 100%;
  position: relative;
  
  &:hover, &:focus-within {
    transform: scale(1.03);
    z-index: 10;
  }
  
  &:active {
    transform: scale(0.98);
    transition: all 0.1s ease;
  }
  
  /* Add ripple effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 70%);
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: none;
  }
  
  &:active::after {
    opacity: 1;
    transition: opacity 0.1s ease;
  }
  
  /* Responsive adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    &:hover, &:focus-within {
      transform: scale(1.02); /* Slightly reduced scale effect on tablet */
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    &:hover, &:focus-within {
      transform: scale(1.01); /* Minimal scale effect on mobile */
    }
  }
`;

const StyledBox = styled.div<{
    variant: InstructionVariant;
    isHovered: boolean;
    hasDebug: boolean;
}>`
  position: relative;
  background-color: ${({ variant }) =>
        variant === 'transparent' ? 'transparent' :
            variant === 'noBorder' ? 'white' :
                'transparent'
    };
  border: ${({ variant }) =>
        variant === 'default' ? '2px solid black' :
            'none'
    };
  border-radius: 4px;
  padding: 1.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  transition: all 0.25s ease;
  box-shadow: ${({ isHovered }) =>
        isHovered ? '0 8px 16px rgba(0,0,0,0.15)' : 'none'
    };
  border-color: ${({ isHovered, variant }) =>
        isHovered ? 'black' :
            variant === 'default' ? 'black' :
                'transparent'
    };
  border-width: ${({ isHovered }) =>
        isHovered ? '2.5px' : '2px'
    };
  
  /* Debug outline */
  outline: ${({ hasDebug, theme }) =>
        hasDebug ? theme.debug?.outlines?.component || '1px dashed rgba(255, 0, 0, 0.5)' : 'none'
    };
  
  /* Responsive adjustments */
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem 1.75rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 1.25rem 1.5rem;
  }
`;

/**
 * Processes text content that uses special markers for styling
 * 
 * Supported markers:
 * - [primary]Text[/primary] - Highlight text with primary color
 * - [secondary]Text[/secondary] - Highlight text with secondary accent color
 * - [bold]Text[/bold] - Make text bold
 * - [action]Text[/action] - Style as an action (bold)
 * 
 * @param content Text content with markers
 * @param variant Typography variant to apply
 * @param parentWeight The font weight of the parent container, if any
 * @returns Array of React elements with styled text
 */
const processTextWithMarkers = (
    content: string,
    variant: TextProps['variant'] = 'layoutInstruction',
    parentWeight?: WeightKey
): React.ReactNode[] => {
    if (!content || typeof content !== 'string') return [content];

    // Define regex patterns for markers
    const markerPattern = /\[(primary|secondary|bold|action)\](.*?)\[\/(primary|secondary|bold|action)\]/g;

    // Split the content into parts (regular text and styled text)
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Find all marker matches
    while ((match = markerPattern.exec(content)) !== null) {
        const [fullMatch, markerType, text] = match;
        const startIndex = match.index;

        if (startIndex > lastIndex) {
            const regularText = content.substring(lastIndex, startIndex);
            parts.push(
                <Text
                    key={`text-${lastIndex}`}
                    as="span"
                    variant={variant}
                    weight={parentWeight}
                >
                    {regularText}
                </Text>
            );
        }

        const highlightWeight = parentWeight === 'bold' ? 'extrabold' : 'bold';

        // Create the styled text component based on marker type
        if (markerType === 'primary') {
            parts.push(
                <Text
                    key={`${markerType}-${startIndex}`}
                    as="span"
                    variant={variant}
                    color="primary"
                    weight={highlightWeight}
                >
                    {text}
                </Text>
            );
        } else if (markerType === 'secondary') {
            parts.push(
                <Text
                    key={`${markerType}-${startIndex}`}
                    as="span"
                    variant={variant}
                    color="secondaryAccent"
                    weight={highlightWeight}
                >
                    {text}
                </Text>
            );
        } else if (markerType === 'bold' || markerType === 'action') {
            parts.push(
                <Text
                    key={`${markerType}-${startIndex}`}
                    as="span"
                    variant={variant}
                    weight={highlightWeight}
                >
                    {text}
                </Text>
            );
        }

        // Update the last index
        lastIndex = startIndex + fullMatch.length;
    }

    if (lastIndex < content.length) {
        const regularText = content.substring(lastIndex);
        parts.push(
            <Text
                key={`text-${lastIndex}`}
                as="span"
                variant={variant}
                weight={parentWeight}
            >
                {regularText}
            </Text>
        );
    }

    return parts;
};

export function InstructionBox({
    children,
    variant = 'default',
    textProps,
    onClick,
    sx,
    className = '',
}: InstructionBoxProps) {
    const theme = useTheme();
    const [isHovered, setIsHovered] = React.useState(false);

    // Debug settings
    const debugEnabled = theme.debug?.enabled;
    const debugLabels = debugEnabled && theme.debug?.labels?.enabled;
    const labelPosition = theme.debug?.labels?.position || 'top-left';

    // Default text props with increased font size and responsive adjustments
    const defaultTextProps: Partial<TextProps> = {
        style: {
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', // Responsive font size
            textAlign: textProps?.align || 'center',
            width: '100%',
            fontWeight: 500,
            ...sx
        },
        ...textProps
    };

    // Process text content if it contains markers and is a string
    const processedChildren = React.useMemo(() => {
        if (typeof children === 'string') {
            // Always process string content to ensure consistent styling
            return processTextWithMarkers(
                children,
                textProps?.variant,
                textProps?.weight
            );
        }
        return children;
    }, [children, textProps?.variant, textProps?.weight]);

    return (
        <AnimatedBoxWrapper
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={className}
        >
            {debugLabels && (
                <DebugLabel enabled={debugLabels} position={labelPosition}>
                    InstructionBox
                </DebugLabel>
            )}

            <StyledBox
                variant={variant}
                isHovered={isHovered}
                hasDebug={debugEnabled}
                onClick={onClick}
                style={sx}
            >
                {textProps
                    ? <Text {...defaultTextProps}>{processedChildren}</Text>
                    : processedChildren}
            </StyledBox>
        </AnimatedBoxWrapper>
    );
}