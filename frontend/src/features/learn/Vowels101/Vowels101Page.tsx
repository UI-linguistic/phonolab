// src/features/learn/Vowels101/Vowels101Page.tsx

import React, { useState } from 'react';
import { Vowels101Layout } from '@components/ui/LearnLayout';
import TongueSection from './components/TongueSection';
import LipSection from './components/LipSection';
import LengthSection from './components/LengthSection';
import FreePlacementDemo from './components/FreePlacementDemo';
import { Button } from '@mantine/core';

export default function Vowels101Page() {
    const [activeTab, setActiveTab] = useState(0);
    const [showFreeDemo, setShowFreeDemo] = useState(false);

    const tongueNodes = TongueSection();
    const lipNodes = LipSection();
    const lengthNodes = LengthSection();

    const allSections = [tongueNodes, lipNodes, lengthNodes];

    if (showFreeDemo) {
        return (
            <div style={{ padding: '20px' }}>
                <Button
                    onClick={() => setShowFreeDemo(false)}
                    mb={20}
                    color="blue"
                >
                    Back to Regular Layout
                </Button>
                <FreePlacementDemo />
            </div>
        );
    }

    return (
        <Vowels101Layout
            title="Vowels are organized in three ways:"
            showBackButton
            activeTabIndex={activeTab}
            onTabSelect={setActiveTab}
            additionalButton={
                <Button
                    size="sm"
                    color="green"
                    onClick={() => setShowFreeDemo(true)}
                >
                    Try Free Placement
                </Button>
            }
        >
            {allSections[activeTab]}
        </Vowels101Layout>
    );
}

// PENDING UPDATE BUT WORKS WITH BACKEND!
