// src/features/learn/Vowels101/components/TongueSection.tsx

import React, { useState } from 'react'
import { Vowels101TonguePositionLearnGrid } from '@components/display/GridPresets'
import { MediaCell } from '@components/display'
import { Vowels101Instructions } from '@components/ui/InstructionWrappers'
import { Vowel } from '@api/types'
import { Text } from '@components/typography/PageTypography'
import { useAudio } from './useAudio'


export default function TongueSection() {
    const [selectedPhoneme, setSelectedPhoneme] = useState<Vowel | null>(null)
    const { play } = useAudio();



    // Column 1: Instruction wrapper
    const instructions = <Vowels101Instructions key="instructions" />

    // Column 2: Grid
    const grid = (
        <Vowels101TonguePositionLearnGrid
            key="grid"
            onPhonemeSelect={setSelectedPhoneme}
        />
    )

    // Column 3: Media area
    const media = (
        <MediaCell key="media" audioSrc={selectedPhoneme?.audio_url}>
            {selectedPhoneme ? (
                <>
                    {selectedPhoneme.tongue_image_url && (
                        <img
                            src={selectedPhoneme.tongue_image_url}
                            alt="Tongue position illustration"
                            style={{ maxWidth: '100%', maxHeight: 180 }}
                        />
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
