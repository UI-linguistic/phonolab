// src/components/DataDrivenGrid.tsx

/*────────────────────────────────────────────────────────────
  1. Imports
───────────────────────────────────────────────────────────*/
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ConfigurableGrid, GridItem, ConfigurableGridProps } from './ConfigurableGrid';
import { LoadingOverlay, Box, Text } from '@mantine/core';

/*────────────────────────────────────────────────────────────
  2. DataDrivenGridProps<T>
  - endpoint: URL to fetch array of T
  - fallbackImporter: dynamic import for local JSON fallback
  - mapNodeToGridItem: transform T → GridItem (supports multi‑object cells)
  - other gridProps: any ConfigurableGrid props except `items`
───────────────────────────────────────────────────────────*/
export interface DataDrivenGridProps<T>
    extends Omit<ConfigurableGridProps, 'items'> {
    endpoint: string;
    fallbackImporter: () => Promise<{ default: T[] }>;
    mapNodeToGridItem: (node: T) => GridItem;
}

/*────────────────────────────────────────────────────────────
  3. DataDrivenGrid component
───────────────────────────────────────────────────────────*/
export function DataDrivenGrid<T>({
    endpoint,
    fallbackImporter,
    mapNodeToGridItem,
    ...gridProps
}: DataDrivenGridProps<T>) {
    const [nodes, setNodes] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;
        axios
            .get<T[]>(endpoint)
            .then((res) => {
                if (!mounted) return;
                setNodes(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.warn('API fetch failed, falling back to local JSON', err);
                fallbackImporter()
                    .then((mod) => {
                        if (!mounted) return;
                        setNodes(mod.default);
                        setLoading(false);
                    })
                    .catch((fallbackErr) => {
                        if (!mounted) return;
                        setError(fallbackErr);
                        setLoading(false);
                    });
            });
        return () => {
            mounted = false;
        };
    }, [endpoint]);

    // Loading / Error states
    if (loading) {
        return (
            <Box mih={200} pos="relative">
                <LoadingOverlay visible />
            </Box>
        );
    }
    if (error) {
        return (
            <Text color="red">Error loading data: {error.message}</Text>
        );
    }

    // Map nodes → grid items
    const items: GridItem[] = nodes.map(mapNodeToGridItem);

    /*───────────────────────────────────────────────────────────
      4. Render ConfigurableGrid with dynamic items
    ────────────────────────────────────────────────────────────*/
    return <ConfigurableGrid items={items} {...gridProps} />;
}

/*────────────────────────────────────────────────────────────
  5. Example usage of DataDrivenGrid for Tongue Position quiz
───────────────────────────────────────────────────────────*/
/*
import { InteractiveObject } from './InteractiveObject';
import { NodeObject } from '../data/types';

export function TonguePositionQuizGrid() {
  return (
    <DataDrivenGrid<NodeObject>
      endpoint="/api/quiz/tongue-position"
      fallbackImporter={() => import('../data/quiz/tongue-position.json')}
      mapNodeToGridItem={(node) => {
        // if two objects per cell:
        if (node.secondaryId) {
          return {
            id: node.id,
            content: (
              <>
                <InteractiveObject id={node.id} label={node.label} audioSrc={node.audioSrc} />
                <InteractiveObject id={node.secondaryId} label={node.secondaryLabel!} audioSrc={node.secondaryAudioSrc!} />
              </>
            ),
          };
        }
        // single object cell:
        return {
          id: node.id,
          content: <InteractiveObject id={node.id} label={node.label} audioSrc={node.audioSrc} />,
        };
      }}
      mode="static"
      cols={4}
      spacing="md"
      breakpoints={[
        { maxWidth: 480, cols: 1 },
        { maxWidth: 768, cols: 2 },
        { maxWidth: 1024, cols: 4 },
      ]}
      onSelect={(item, idx, row, col) => {/* quiz logic /}}
    />
  );
}
*/
