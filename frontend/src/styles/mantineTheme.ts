/**
 * Mantine theme override mapping
 * styled-components tokens → Mantine shape
 */
import { MantineThemeOverride } from '@mantine/core';
import scTheme from './theme';

// helper: convert rem strings (based on 1rem=16px) to numeric px
const remToPx = (rem: string) => parseFloat(rem) * 16;

const mantineTheme: MantineThemeOverride = {
    // ────────────────────────────────────────────────────────────
    // Color Palette
    // ────────────────────────────────────────────────────────────
    colors: scTheme.colors as any,
    primaryColor: 'primary',

    // ────────────────────────────────────────────────────────────
    // Spacing (px)
    // ────────────────────────────────────────────────────────────
    spacing: {
        xs: `${remToPx(scTheme.spacing.xsmall)}px`,  // 6.4px
        sm: `${remToPx(scTheme.spacing.small)}px`,   // 12.8px
        md: `${remToPx(scTheme.spacing.medium)}px`,  // 25.6px
        lg: `${remToPx(scTheme.spacing.large)}px`,   // 38.4px
        xl: `${remToPx(scTheme.spacing.xlarge)}px`,  // 51.2px
    },

    // ────────────────────────────────────────────────────────────
    // Border radius
    // ────────────────────────────────────────────────────────────
    radius: {
        sm: `${remToPx(scTheme.borderRadius)}px`,    // 8px
        md: `${remToPx(scTheme.borderRadius)}px`,
        lg: `${remToPx(scTheme.borderRadius)}px`,
    },

    // ────────────────────────────────────────────────────────────
    // Typography
    // ────────────────────────────────────────────────────────────
    fontFamily: scTheme.fonts.main,
    headings: {
        fontFamily: scTheme.fonts.heading,
    },

    // ────────────────────────────────────────────────────────────
    // Breakpoints
    // ────────────────────────────────────────────────────────────
    breakpoints: scTheme.breakpoints,

    // you can map more (shadows, zIndex, etc.) as needed…
};

export default mantineTheme;
