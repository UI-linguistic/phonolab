// src/features/learn/Vowels101/components/TongueSection.tsx

import React, { useState } from 'react'
import { Vowels101TonguePositionLearnGrid } from '@components/display/GridPresets'
import { MediaCell } from '@components/display'
import { Vowels101Instructions } from '@components/ui/InstructionWrappers'
import { Vowel } from '@api/types'
import { Text } from '@components/typography/PageTypography'

export default function TongueSection() {
    const [selectedPhoneme, setSelectedPhoneme] = useState<Vowel | null>(null)

    // Column 1: Instruction wrapper
    const instructions = <Vowels101Instructions key="instructions" />

    // Column 2: Grid
    const grid = (
        <Vowels101TonguePositionLearnGrid
            key="grid"
        // onPhonemeSelect={setSelectedPhoneme}
        />
    )

    // Column 3: Media area
    const media = (
        <MediaCell key="media">
            {selectedPhoneme ? (
                <>
                    {selectedPhoneme.tongue_image_url && (
                        <img
                            src={selectedPhoneme.tongue_image_url}
                            alt="Tongue position illustration"
                            style={{ maxWidth: '100%', maxHeight: 180 }}
                        />
                    )}
                    {selectedPhoneme.audio_url && (
                        <audio controls src={selectedPhoneme.audio_url} />
                    )}
                </>
            ) : (
                <Text variant="body" color="textSubtle" margin="0">
                    Select a vowel to see details
                </Text>
            )}
        </MediaCell>
    )

    return (
        <>
            {instructions}
            {grid}
            {media}
        </>
    )
}
