import React, { useState } from 'react';
import { Vowels101TonguePositionLearnGrid } from '@components/display/GridPresets';
import { Cell, MediaCell } from '@components/display';
import { Vowel } from '@api/types';
// import your media and instruction components as needed

export default function TongueSection() {
    const [selectedPhoneme, setSelectedPhoneme] = useState<Vowel | null>(null);

    // For now, just focus on Tongue Position
    return (
        <>
            {/* Column 1: Instructions */}
            <div>
                <Cell>
                    Vowels are distinguished by the part of the tongue used to make the sound (front to back)…
                </Cell>
                <Cell>
                    And the placement of the tongue relative to the roof of the mouth (high to low).
                </Cell>
                <Cell>
                    Click a vowel in the grid to hear it and learn how to place your tongue!
                </Cell>
            </div>

            {/* Column 2: Grid */}
            <Vowels101TonguePositionLearnGrid
            // onPhonemeSelect={setSelectedPhoneme} // Remove for now, see note below
            />

            {/* Column 3: Media Area */}
            <MediaCell>
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
                    <div>Select a vowel to see details</div>
                )}
            </MediaCell>
        </>
    );
}