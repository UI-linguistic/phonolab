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
    headings: { fontFamily: scTheme.fonts.poppins },

    fontSizes: {
        xs: remToPx(scTheme.fontSizes.xs),
        sm: remToPx(scTheme.fontSizes.sm),
        md: remToPx(scTheme.fontSizes.md),
        lg: remToPx(scTheme.fontSizes.lg),
        xl: remToPx(scTheme.fontSizes.xl),
        xxl: remToPx(scTheme.fontSizes.xxl),
    },

    lineHeights: {
        xs: scTheme.lineHeights.xs.toString(),
        sm: scTheme.lineHeights.sm.toString(),
        md: scTheme.lineHeights.md.toString(),
        lg: scTheme.lineHeights.lg.toString(),
        xl: scTheme.lineHeights.xl.toString(),
        xxl: scTheme.lineHeights.xxl.toString(),
    },

    // fontWeights: {
    //     light: scTheme.fontWeights.light.toString(),
    //     normal: scTheme.fontWeights.normal.toString(),
    //     medium: scTheme.fontWeights.medium.toString(),
    //     bold: scTheme.fontWeights.bold.toString(),
    //     extrabold: scTheme.fontWeights.extrabold.toString(),
    // },
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
};

export default mantineTheme;
