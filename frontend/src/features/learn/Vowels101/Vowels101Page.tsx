// src/features/learn/Vowels101/Vowels101Page.tsx

import React, { useState } from 'react';
import { Vowels101Layout } from '@components/ui/LearnLayout';
import TongueSection from './components/TongueSection';
import LipSection from './components/LipSection';
import LengthSection from './components/LengthSection';

export default function Vowels101Page() {
    const [activeTab, setActiveTab] = useState(0);

    const tongueNodes = TongueSection();
    const lipNodes = LipSection();
    const lengthNodes = LengthSection();

    const allSections = [tongueNodes, lipNodes, lengthNodes];

    return (
        <Vowels101Layout
            title="Vowels are organized in three ways:"
            showBackButton
            activeTabIndex={activeTab}
            onTabSelect={setActiveTab}
        // slotDirections={['column', 'column', 'column']}
        // variant="threeColumns"
        >
            {allSections[activeTab]}
        </Vowels101Layout>
    );
}

// PENDING UPDATE BUT WORKS WITH BACKEND!
