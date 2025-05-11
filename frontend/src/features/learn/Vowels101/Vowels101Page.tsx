// src/features/learn/Vowels101/Vowels101Page.tsx

import React, { useState } from 'react';
import { Vowels101Layout } from '@components/ui/LearnLayout';
import TongueSection from './components/TongueSection';
// import LipSection from './components/LipSection';
// import LengthSection from './components/LengthSection';

export default function Vowels101Page() {
    const [activeTab, setActiveTab] = useState(0);

    // Placeholder for future sections
    const sections = [
        <TongueSection key="tongue" />,
        // <LipSection key="lip" />,
        // <LengthSection key="length" />,
    ];

    return (
        <Vowels101Layout
            title="Vowels are organized in three ways:"
            showBackButton
            activeTabIndex={activeTab}
            onTabSelect={setActiveTab}
            slotDirections={['column', 'column', 'column']}
        >
            {sections[activeTab]}
        </Vowels101Layout>
    );
}

// PENDING UPDATE BUT WORKS WITH BACKEND!

export { };