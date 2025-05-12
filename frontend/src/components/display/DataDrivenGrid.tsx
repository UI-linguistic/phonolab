/**
 * DataDrivenGrid.tsx
 * 
 * A smart grid component that loads and displays data automatically.
 * 
 * Key Features:
 * • Fetches data from API endpoints
 * • Has offline fallback data
 * • Supports two modes:
 *   - "static" (read-only, for learning)
 *   - "sortable" (drag-and-drop, for quizzes)
 * 
 * Props You Can Use:
 * • endpoint: URL to fetch data from
 * • fallbackImporter: Function to load offline data
 * • mapNodeToGridItem: How to display each item
 * • mode: "static" or "sortable"
 * • cols: Number of columns (1-4)
 * • spacing: "sm" or "md" for gaps
 * 
 * Usage Example:
 * ```tsx
 * <DataDrivenGrid
 *   endpoint="/api/vowels"
 *   fallbackImporter={importVowels}
 *   mapNodeToGridItem={(item) => ({
 *     id: item.id,
 *     content: <VowelCard {...item} />
 *   })}
 *   mode="static"
 *   cols={3}
 *   spacing="md"
 * />
 * ```
 */
// src/components/DataDrivenGrid.tsx
// src/components/DataDrivenGrid.tsx

import { useEffect, useState } from 'react'
import { LoadingOverlay, Box, Text as MantineText } from '@mantine/core'
import { api } from '@api/client'
import { ConfigurableGrid, GridItem, ConfigurableGridProps } from './ConfigurableGrid'
import { Lesson, LessonSection, Vowel, VowelGridCell } from '@api/types'

export interface DataDrivenGridProps<T> extends Omit<ConfigurableGridProps, 'items'> {
  /** full URL (or path) to fetch from */
  endpoint: string
  /** dynamic import of a fallback JSON if the network request fails */
  fallbackImporter: () => Promise<{ default: T[] }>
  /** map a single T to a GridItem */
  mapNodeToGridItem: (node: T) => GridItem
}

export function DataDrivenGrid<T>({
  endpoint,
  fallbackImporter,
  mapNodeToGridItem,
  ...gridProps
}: DataDrivenGridProps<T>) {
  const [nodes, setNodes] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true

    api
      .get<T[]>(endpoint)
      .then((res) => {
        if (!mounted) return
        console.log('[DataDrivenGrid] API data:', res.data);
        setNodes(res.data)
        setLoading(false)
      })
      .catch(() => {
        fallbackImporter()
          .then((mod) => {
            if (!mounted) return

            // treat mod as any so TS stops complaining
            const raw = (mod as any).default
            console.log('[DataDrivenGrid] Fallback raw data:', raw);

            // If it's already an array, use it.
            // Otherwise assume it's an "envelope" with data.sections
            const data: T[] = Array.isArray(raw)
              ? raw
              : Array.isArray(raw.data?.sections)
                ? raw.data.sections
                : []

            console.log('[DataDrivenGrid] Fallback mapped data:', data);
            setNodes(data)
            setLoading(false)
          })
          .catch((fallbackErr) => {
            if (!mounted) return
            setError(fallbackErr)
            setLoading(false)
          })
      })

    return () => {
      mounted = false
    }
  }, [endpoint, fallbackImporter])

  if (loading) {
    return (
      <Box mih={200} pos="relative">
        <LoadingOverlay visible />
      </Box>
    )
  }

  if (error) {
    return <MantineText color="red">Error loading data: {error.message}</MantineText>
  }

  const items = nodes.map(mapNodeToGridItem)
  console.log('[DataDrivenGrid] items.length:', items.length, 'items:', items);
  if (gridProps && 'cols' in gridProps) {
    // gridProps is spread, so check if cols is present
    // (in practice, cols should always be present)
    // eslint-disable-next-line
    // @ts-ignore
    console.log('[DataDrivenGrid] gridProps.cols:', gridProps.cols);
  }
  return <ConfigurableGrid items={items} {...gridProps} />
}


/**
 * Given a dynamic‐importer of either:
 *  - Lesson (object), or
 *  - Lesson[] (array of lessons),
 * this returns a promise that resolves to a flat array of that lesson's sections.
 */
export async function extractSections(
  importer: () => Promise<{ default: Lesson | Lesson[] }>
): Promise<{ default: LessonSection[] }> {
  const mod = await importer();
  const raw = mod.default;
  // pick first lesson if array
  const lesson = Array.isArray(raw) && raw.length
    ? (raw[0] as Lesson)
    : (raw as Lesson);

  // pull all section objects into an array
  const sections = Object.values(lesson.sections);
  return { default: sections };
}


/**  
 * Given an importer for the full preview JSON,  
 * extract `content.tongue_position.grid` and turn it into `VowelGridCell[]`.  
 */
export async function fallbackTongueGrid(
  importer: () => Promise<{ default: any }>
): Promise<{ default: VowelGridCell[] }> {
  const mod = await importer();
  const raw: any[][][] = mod.default.content.tongue_position.grid;
  console.log('Raw tongue grid data:', raw);

  // Ensure 3x3 structure - format should be [row][col][vowels]
  // The flatMap here is flattening our 2D array into 1D, which might be causing the issue
  const cells = [];
  for (let row = 0; row < raw.length; row++) {
    for (let col = 0; col < raw[row].length; col++) {
      const cellArr = raw[row][col];
      const vowels: Vowel[] = cellArr.map((rv: any) => ({
        id: Number(rv.id),
        ipa: rv.ipa,
        audio_url: rv.audio_url[0],
        fallback_audio_url: rv.audio_url[1],
        lip_image_url: '',
        tongue_image_url: rv.mouth_image_url,
      }));

      cells.push({
        id: row * raw[row].length + col,
        row,
        col,
        vowels
      });
    }
  }

  console.log('Processed cells:', cells);
  return { default: cells };
}
