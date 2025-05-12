// src/components/display/InstructionBox.tsx

import React, { ReactNode } from 'react'
import { Paper, useMantineTheme } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import styles from '../display/Cell.module.css'   // make sure this path is correct
import { Text, TextProps } from '@components/typography/PageTypography'
import styled from 'styled-components'

export type InstructionVariant =
    | 'default'      // transparent bg + black border
    | 'noBorder'     // white bg, no border
    | 'transparent'  // no bg, no border

export interface InstructionBoxProps {
    children: ReactNode
    variant?: InstructionVariant
    textProps?: Omit<TextProps, 'children'>
    onClick?: () => void
    sx?: React.CSSProperties
    className?: string
}

// Add animated wrapper for enhanced interactive effects
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
`;

export function InstructionBox({
    children,
    variant = 'default',
    textProps,
    onClick,
    sx,
    className = '',
}: InstructionBoxProps) {
    const theme = useMantineTheme()
    const { hovered, ref } = useHover()

    // Build up the class list
    const boxClass = [
        styles.cell,
        hovered && styles.cellHover,
        variant === 'noBorder' && styles.noBorder,
        variant === 'transparent' && styles.noBackground,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    // Default text props with increased font size
    const defaultTextProps: Partial<TextProps> = {
        style: {
            fontSize: '1.5rem',
            textAlign: 'center',
            width: '100%',
            fontWeight: 500
        },
        ...textProps
    }

    return (
        <AnimatedBoxWrapper>
            <Paper
                ref={ref}
                component="div"
                className={boxClass}
                onClick={onClick}
                styles={(theme) => ({
                    root: {
                        backgroundColor: 'transparent',
                        border: variant === 'default' ? '2px solid black' : undefined,
                        borderRadius: '4px',
                        padding: '1.75rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        width: '100%',
                        height: '100%',
                        transition: 'all 0.25s ease',
                        boxShadow: hovered ? '0 8px 16px rgba(0,0,0,0.15)' : 'none',
                        borderColor: hovered ? 'black' : variant === 'default' ? 'black' : undefined,
                        borderWidth: hovered ? '2.5px' : '2px',
                        cursor: onClick ? 'pointer' : 'default',
                        ...sx,
                    }
                })}
            >
                {textProps
                    ? <Text {...defaultTextProps}>{children}</Text>
                    : children}
            </Paper>
        </AnimatedBoxWrapper>
    )
}
