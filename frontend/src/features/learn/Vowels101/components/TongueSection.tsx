import React, { useState } from 'react';
import { Vowels101Layout } from '@components/ui/LearnLayout';
import { Vowels101TonguePositionLearnGrid } from '@components/display/GridPresets';
import { Cell, MediaCell } from '@components/display';
import { Vowel } from '@api/types';
// import your media and instruction components as needed

export default function Vowels101Page() {
    const [activeTab, setActiveTab] = useState(0); // 0: Tongue, 1: Lip, 2: Length
    const [selectedPhoneme, setSelectedPhoneme] = useState<Vowel | null>(null);

    // You can swap out the grid and media area based on activeTab
    // For now, let's focus on Tongue Position (activeTab === 0)

    return (
        <Vowels101Layout
            title="Vowels are organized in three ways:"
            showBackButton
            activeTabIndex={activeTab}
            onTabSelect={setActiveTab}
            slotDirections={['column', 'column', 'column']}
        >
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
        </Vowels101Layout>
    );
}