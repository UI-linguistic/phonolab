/**
 * GridPresets.tsx
 * 
 * A collection of ready-to-use grid layouts for different learning activities.
 * 
 * Quick Guide:
 * 1. Learn Grids (Static Mode):
 *    • Vowels101TonguePositionLearnGrid - 3×3 grid for tongue position vowels
 *    • Vowels101LipShapeLearnGrid      - 3×3 grid for lip shape vowels
 *    • Vowels101LengthLearnGrid        - 3×3 grid for vowel length
 * 
 * 2. Grapheme Grids (Static Mode):
 *    • GraphemesGetYourGraphemesRightGrid - 2×2 grid for basic graphemes
 *    • GraphemesTackleTrickyPairsGrid    - 2×2 grid for tricky pairs
 * 
 * 3. Quiz Grids (Sortable Mode):
 *    • VowelShuffle*Grids - 4×4 grids for vowel sorting
 *    • SpellAndTellQuizGrid - 3×3 grid for spelling practice
 *    • PairPlayQuizGrid    - 2×2 grid for pair matching
 *    • PhonicTrioQuizGrid  - 3×3 grid for trio matching
 * 
 * How It Works:
 * • Each grid uses DataDrivenGrid under the hood
 * • Two modes: "static" (learn) and "sortable" (quiz)
 * • Automatically loads data from API endpoints
 * • Has fallback data if API is offline
 * 
 * Usage Example:
 * ```tsx
 * import { Vowels101TonguePositionLearnGrid } from './GridPresets';
 * 
 * function MyPage() {
 *   return <Vowels101TonguePositionLearnGrid />;
 * }
 * ```
 */

// src/components/GridPresets.tsx

/*────────────────────────────────────────────────────────────
  Named Grid Presets Using Centralized API Config
  - Pulls endpoints & fallback importers from src/config/api.ts
  - Uses generic DataDrivenGrid under the hood
───────────────────────────────────────────────────────────*/
import React from 'react';
import { DataDrivenGrid, DataDrivenGridProps, fallbackTongueGrid } from './DataDrivenGrid';
import { InteractiveObject } from './InteractiveObject';
import { Box } from '@mantine/core';
import { GridItem } from './ConfigurableGrid';
import API_CONFIG from '@api/api';
import { Vowel, VowelGridCell, RawLesson, RawVowel } from '@api/types';

// Utility to extract array from API envelope fallback
function extractSections(importer: () => Promise<any>) {
    return async () => {
        const mod = await importer();
        console.log("Extract Sections - raw import:", mod);

        if (mod.default && mod.default.data && Array.isArray(mod.default.data.sections)) {
            const sections = mod.default.data.sections;
            console.log("Extract Sections - using data.sections:", sections);
            return { default: sections };
        }

        // Check if we need to restructure the grid data
        if (mod.default && mod.default.content && mod.default.content.tongue_position) {
            console.log("Found tongue_position data, restructuring...");
            const gridData = mod.default.content.tongue_position.grid;

            if (Array.isArray(gridData)) {
                // This should be a 3×3 grid structure [row][col][vowels]
                const cells = [];
                for (let row = 0; row < gridData.length; row++) {
                    for (let col = 0; col < gridData[row].length; col++) {
                        const vowels = gridData[row][col].map((v: any) => ({
                            id: v.id,
                            ipa: v.ipa,
                            audio_url: v.audio_url[0],
                            fallback_audio_url: v.audio_url[1],
                            tongue_image_url: v.mouth_image_url,
                        }));

                        cells.push({
                            id: `${row}-${col}`,
                            row,
                            col,
                            vowels
                        });
                    }
                }
                console.log("Restructured cells:", cells);
                return { default: cells };
            }
        }

        console.log("Extract Sections - using raw default:", mod.default);
        return mod;
    };
}

// ────────────────────────────────────────────────────────────
// 1. Mapper functions
// ────────────────────────────────────────────────────────────

/**
 * Learn mode mapper:
 * - Wraps each cell's phoneme objects in InteractiveObject frames
 * - Supports zero, one, or multiple vowels per cell
 */
const learnMapper = (cell: VowelGridCell | null): GridItem<VowelGridCell> => {
    if (!cell || !Array.isArray(cell.vowels)) {
        return { id: Math.random().toString(36), content: <div /> }
    }

    return {
        id: String(cell.id),
        data: cell,   // stash the raw cell for onSelect
        content: (
            <Box
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                }}
            >
                {cell.vowels.map(v => (
                    <InteractiveObject
                        key={v.id}
                        id={String(v.id)}
                        label={v.ipa}
                        textProps={{ variant: 'gridPhoneme' }}
                        audioUrls={[
                            v.audio_url,
                            ...(v.fallback_audio_url ? [v.fallback_audio_url] : []),
                        ]}
                    />
                ))}
            </Box>
        ),
    }
}

/**
 * Quiz mode mapper:
 * - Renders IPA symbols only, for drag‑and‑drop ordering
 * - Supports zero, one, or multiple vowels per cell
 */
const quizMapper = (cell: VowelGridCell): GridItem => ({
    id: String(cell.id),
    content: (
        <Box
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
            }}
        >
            {cell.vowels.map((v) => (
                <span key={v.id}>{v.ipa}</span>
            ))}
        </Box>
    ),
});

// ────────────────────────────────────────────────────────────
// 2. Learn Grids
// ────────────────────────────────────────────────────────────
export interface Vowels101TongueGridProps
    extends Omit<DataDrivenGridProps<VowelGridCell>,
        'items' | 'endpoint' | 'fallbackImporter' | 'mapNodeToGridItem'> {
    /** when a phoneme inside any cell is clicked */
    onPhonemeSelect?: (v: Vowel) => void;
}

export function Vowels101TonguePositionLearnGrid({
    onPhonemeSelect,
    ...gridProps
}: Vowels101TongueGridProps) {
    const cfg = API_CONFIG['learn/vowels/tongue-position'];

    // Debug the data structure
    const debugData = async () => {
        try {
            const mod = await cfg.fallbackImporter!();
            console.log("Fallback data structure:", mod);
        } catch (e) {
            console.error("Failed to load fallback data:", e);
        }
    };

    // Call this for debugging
    debugData();

    const mapper: (cell: VowelGridCell) => GridItem = (cell) => {
        if (!cell || !Array.isArray(cell.vowels)) {
            return { id: Math.random().toString(), content: <div /> };
        }

        // Include row/col information for debugging
        console.log(`Cell at row ${cell.row}, col ${cell.col} has ${cell.vowels.length} vowels`);

        return {
            id: String(cell.id),
            content: (
                <Box
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem',
                    }}
                >
                    {cell.vowels.map((v) => (
                        <InteractiveObject
                            key={v.id}
                            id={String(v.id)}
                            label={v.ipa}
                            audioUrls={[v.audio_url, ...(v.fallback_audio_url ? [v.fallback_audio_url] : [])]}
                            onToggle={(_, isActive) => {
                                if (isActive && onPhonemeSelect) {
                                    onPhonemeSelect(v);
                                }
                            }}
                        />
                    ))}
                </Box>
            ),
        };
    };

    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={extractSections(cfg.fallbackImporter!)}
            mapNodeToGridItem={mapper}
            mode="static"
            cols={3}
            spacing="xs"
            {...gridProps}
        />
    );
}

export function Vowels101LipShapeLearnGrid(props: any) {
    const cfg = API_CONFIG['learn/vowels/lip-shape'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={extractSections(cfg.fallbackImporter!)}
            mapNodeToGridItem={learnMapper}
            mode="static"
            cols={3}
            spacing="md"
            {...props}
        />
    );
}

export function Vowels101LengthLearnGrid(props: any) {
    const cfg = API_CONFIG['learn/vowels/length'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={extractSections(cfg.fallbackImporter!)}
            mapNodeToGridItem={learnMapper}
            mode="static"
            cols={3}
            spacing="md"
            {...props}
        />
    );
}

// ────────────────────────────────────────────────────────────
// 3. Graphemes Learn Grids
// ────────────────────────────────────────────────────────────
export function GraphemesGetYourGraphemesRightGrid(props: any) {
    const cfg = API_CONFIG['learn/graphemes/get-your-graphemes-right'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={learnMapper}
            mode="static"
            cols={2}
            spacing="md"
            {...props}
        />
    );
}

export function GraphemesTackleTrickyPairsGrid(props: any) {
    const cfg = API_CONFIG['learn/graphemes/tackle-tricky-pairs'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={learnMapper}
            mode="static"
            cols={2}
            spacing="md"
            {...props}
        />
    );
}

// ────────────────────────────────────────────────────────────
// 4. Quiz Grids
// ────────────────────────────────────────────────────────────
export function VowelShuffleTonguePositionQuizGrid(props: any) {
    const cfg = API_CONFIG['quiz/vowel-shuffle/tongue-position'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={quizMapper}
            mode="sortable"
            cols={4}
            spacing="sm"
            {...props}
        />
    );
}

export function VowelShuffleLipShapeQuizGrid(props: any) {
    const cfg = API_CONFIG['quiz/vowel-shuffle/lip-shape'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={quizMapper}
            mode="sortable"
            cols={4}
            spacing="sm"
            {...props}
        />
    );
}

export function VowelShuffleLengthQuizGrid(props: any) {
    const cfg = API_CONFIG['quiz/vowel-shuffle/length'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={quizMapper}
            mode="sortable"
            cols={4}
            spacing="sm"
            {...props}
        />
    );
}

export function SpellAndTellQuizGrid(props: any) {
    const cfg = API_CONFIG['quiz/spell-and-tell'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={quizMapper}
            mode="sortable"
            cols={3}
            spacing="sm"
            {...props}
        />
    );
}

export function PairPlayQuizGrid(props: any) {
    const cfg = API_CONFIG['quiz/pair-play'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={quizMapper}
            mode="sortable"
            cols={2}
            spacing="sm"
            {...props}
        />
    );
}

export function PhonicTrioQuizGrid(props: any) {
    const cfg = API_CONFIG['quiz/phonic-trio'];
    return (
        <DataDrivenGrid<VowelGridCell>
            endpoint={cfg.url}
            fallbackImporter={cfg.fallbackImporter!}
            mapNodeToGridItem={quizMapper}
            mode="sortable"
            cols={3}
            spacing="sm"
            {...props}
        />
    );
}

// ────────────────────────────────────────────────────────────
// 5. Single export object
// ────────────────────────────────────────────────────────────
const GridPresets = {
    Vowels101TonguePositionLearnGrid,
    Vowels101LipShapeLearnGrid,
    Vowels101LengthLearnGrid,
    GraphemesGetYourGraphemesRightGrid,
    GraphemesTackleTrickyPairsGrid,
    VowelShuffleTonguePositionQuizGrid,
    VowelShuffleLipShapeQuizGrid,
    VowelShuffleLengthQuizGrid,
    SpellAndTellQuizGrid,
    PairPlayQuizGrid,
    PhonicTrioQuizGrid,
};

export default GridPresets;
