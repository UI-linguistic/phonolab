// src/mantine-theme.ts
import { MantineThemeOverride } from '@mantine/core';
import scTheme, { HeroGaps } from './theme';
import type { MantineColorsTuple } from '@mantine/core';

const remToPx = (rem: string) => `${parseFloat(rem) * 16}px`;

// Generate a fixed 10-shade tuple of the same base color
const createColorShades = (base: string): MantineColorsTuple => [
    base, base, base, base, base,
    base, base, base, base, base,
];

type SC = typeof scTheme;

const mantineTheme: MantineThemeOverride = {
    // ────────────────────────────────────────────────────────────
    // 1) Colors
    // ────────────────────────────────────────────────────────────
    colors: Object.fromEntries(
        Object.entries(scTheme.colors).map(([key, val]) => [key, createColorShades(val)])
    ) as Record<keyof SC['colors'], MantineColorsTuple>,

    primaryColor: 'primary',

    // ────────────────────────────────────────────────────────────
    // 2) Spacing & Layout
    // ────────────────────────────────────────────────────────────
    spacing: {
        xs: remToPx(scTheme.spacing.xsmall),
        sm: remToPx(scTheme.spacing.small),
        md: remToPx(scTheme.spacing.medium),
        lg: remToPx(scTheme.spacing.large),
        xl: remToPx(scTheme.spacing.xlarge),
    },

    breakpoints: {
        xs: scTheme.breakpoints.mobile,
        sm: scTheme.breakpoints.tablet,
        md: scTheme.breakpoints.desktop,
        lg: scTheme.breakpoints.widescreen,
    },

    // ────────────────────────────────────────────────────────────
    // 3) Radii & Borders
    // ────────────────────────────────────────────────────────────
    radius: {
        sm: remToPx(scTheme.borderRadius),
        md: remToPx(scTheme.borderRadius),
        lg: remToPx(scTheme.borderRadius),
    },

    // ────────────────────────────────────────────────────────────
    // 4) Typography
    // ────────────────────────────────────────────────────────────
    fontFamily: scTheme.fonts.inter,
    headings: {
        fontFamily: scTheme.fonts.poppins,
        // Set font weights for headings
        fontWeight: scTheme.fontWeights.bold
    },

    fontSizes: {
        xs: remToPx(scTheme.fontSizes.xs),
        sm: remToPx(scTheme.fontSizes.sm),
        md: remToPx(scTheme.fontSizes.md),
        lg: remToPx(scTheme.fontSizes.lg),
        xl: remToPx(scTheme.fontSizes.xl),
        xxl: remToPx(scTheme.fontSizes.xxl),
        // Add xxxl size that exists in our theme
        xxxl: remToPx(scTheme.fontSizes.xxxl),
    },

    lineHeights: {
        xs: scTheme.lineHeights.xs,
        sm: scTheme.lineHeights.sm,
        md: scTheme.lineHeights.md,
        lg: scTheme.lineHeights.lg,
        xl: scTheme.lineHeights.xl,
        xxl: scTheme.lineHeights.xxl,
    },

    // Font weights are passed to Mantine through other properties (headings, etc.)
    // and not directly as a fontWeights property.

    // ────────────────────────────────────────────────────────────
    // 5) Shadows, zIndex, transitions, opacity
    // ────────────────────────────────────────────────────────────
    shadows: {
        xs: scTheme.shadows.low,
        sm: scTheme.shadows.medium,
        md: scTheme.shadows.high,
    },

    // zIndex: {
    //     dropdown: scTheme.layers.dropdown,
    //     modal: scTheme.layers.modal,
    //     tooltip: scTheme.layers.tooltip,
    // },

    // transitionTimingFunction: scTheme.transitions.default,

    // ────────────────────────────────────────────────────────────
    // 6) Custom fields from SC theme
    // ────────────────────────────────────────────────────────────
    // @ts-ignore: passing through extra theme props
    heroGaps: scTheme.heroGaps as HeroGaps,
    // @ts-ignore
    layout: scTheme.layout,
    // @ts-ignore
    tongueGrid: scTheme.tongueGrid,
    // @ts-ignore
    quiz: scTheme.quiz,
    // @ts-ignore
    transitions: scTheme.transitions,
    // @ts-ignore: passing our fontWeights through for custom components
    fontWeightValues: scTheme.fontWeights,
};

export default mantineTheme;
