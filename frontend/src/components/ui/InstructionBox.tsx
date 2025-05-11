// src/components/display/InstructionBox.tsx

import React, { ReactNode } from 'react'
import { Paper, useMantineTheme } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import styles from '../display/Cell.module.css'   // make sure this path is correct
import { Text, TextProps } from '@components/typography/PageTypography'

export type InstructionVariant =
    | 'default'      // border + white bg
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

    return (
        <Paper
            ref={ref}
            component="div"          /* render as div so we ignore Mantine's withBorder */
            className={boxClass}
            onClick={onClick}
            styles={(theme) => ({
                root: {
                    backgroundColor: variant === 'default' ? theme.black : 'transparent',
                    ...sx,
                }
            })}
        >
            {textProps
                ? <Text {...textProps}>{children}</Text>
                : children}
        </Paper>
    )
}
